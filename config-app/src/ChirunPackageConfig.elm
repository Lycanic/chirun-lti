module ChirunPackageConfig exposing (..)


{-  An element which provides the package config editor.
    The flags are a JSON object of the following form:
    {
        "files": a tree of directories in the package, with each node of the form:
            { "path": string
            , "dirs": a list of child directories
            , "files": a list of filenames
            }
        "config": the package's config data.
        "media_root": the base of the URL for files in the package.
    }
-}

import Browser
import Browser.Dom
import Dict exposing (Dict)
import Forest.Navigate as FN exposing (Forest)
import Forest.Path as FP exposing (ForestPath)
import Form
import FS
import Html as H exposing (Html, div)
import Html.Attributes as HA
import Html.ChirunExtra exposing (..)
import Html.Events as HE
import Json.Decode as JD
import Json.Encode as JE
import List.Extra
import Localise exposing (Localisations, localise)
import Task
import Tree exposing (Tree)
import Tree.Navigate as TN
import Tree.Navigate.Extra exposing (move_right, move_up, move_down)
import Tree.Path as TP
import Tree.Zipper as TZ
import Tuple exposing (pair)

main = Browser.element
    { init = init
    , update = update
    , subscriptions = \_ -> Sub.none
    , view = view
    }

{- Wrappers for settings, so that all kinds of data can be stored in a `SettingsDict`. -}
type Setting
    = StringSetting String
    | IntSetting Int
    | BoolSetting Bool
    | DictSetting (Dict String Setting)
    | ListSetting (List Setting)

{- A dictionary of settings for a package or item. -}
type alias SettingsDict = Dict String Setting

{- The top-level package config model: a dictionary of package-level settings, a forest of content items, and a list of themes. -}
type alias Package = 
    { settings : SettingsDict
    , content : Forest ContentItem
    , themes : List Theme
    }

{- Types of content item. -}
type ContentItemType
    = Introduction
    | Part
    | Chapter
    | Document
    | Standalone
    | Slides
    | Notebook
    | URL
    | HTML
    | Exam

content_item_types : List ContentItemType
content_item_types =
    [ Introduction
    , Part
    , Chapter
    , Document
    , Standalone
    , Slides
    , Notebook
    , URL
    , HTML
    , Exam
    ]

{-  The model for a content item: a type and a dictionary of settings.
    The `Tree` model manages parent-child relationships.
-}
type alias ContentItem =
    { settings : SettingsDict
    , type_ : ContentItemType
    }

{- Model for a theme. Not currently used. -}
type alias Theme =
    { source : String
    , title : String
    , path : String
    , hidden : Bool
    }

{- Directions that an item can move in the tree structure.
    Up: Swap with the previous sibling, or move to the parent list just above the current parent.
    Down: Swap with the next sibling, or move to the parent list just below the current parent.
    Right: If the previous sibling is an item with children, then become its last child.
-}
type ListDirection
    = Up
    | Down
    | Right

{- Messages that modify content items. -}
type ItemMsg
    = Delete
    | SetSetting String Setting
    | SetType ContentItemType
    | Move ListDirection String

{- Messages for the main model. -}
type Msg
    = SetTab Tab
    | ItemMsg ItemMsg ItemPath
    | SetPackageSetting (List String) String Setting
    | AddItem (Maybe ItemPath) ContentItemType
    | FocusButton (Result Browser.Dom.Error ())

{- A reference to an item in the content structure: a path in the forest of content items. -}
type alias ItemPath = ForestPath 

{- The possible views for the main editor tab. -}
type Tab
    = PackageSettingsTab
    | ContentItemTab ItemPath
    | CreateItemTab (Maybe ItemPath)

{- The main app model. -}
type alias Model =
    { localisations: Localisations
    , tab : Tab
    , package : Package
    , files : FS.FileTree
    , media_root : String
    , err : Maybe String
    }

{- Default package setting values. -}
package_defaults = Dict.fromList
    [ ("title", StringSetting "")
    , ("author", StringSetting "")
    , ("institution", StringSetting "")
    , ("year", StringSetting "")
    , ("locale", StringSetting "")
    , ("static_dir", StringSetting "")
    , ("root_url", StringSetting "")
    , ("build_pdf", BoolSetting True)
    , ("build_zip", BoolSetting True)
    , ("num_pdf_runs", IntSetting 1)
    , ("mathjax_url", StringSetting "")
    , ("css", ListSetting [])
    , ("js", ListSetting [])
    , ("license", DictSetting (Dict.fromList
        [ ("name", StringSetting "")
        , ("year", StringSetting "")
        , ("url", StringSetting "")
        , ("by", StringSetting "")
        ]
      ))
    ]

{- Default item setting values. -}
item_defaults = Dict.fromList
    [ ("title", StringSetting "Unnamed item")
    , ("slug", StringSetting "")
    , ("author", StringSetting "")
    , ("source", StringSetting "")
    , ("is_hidden", BoolSetting False)
    , ("build_pdf", BoolSetting True)
    , ("pdf_url", StringSetting "")
    , ("sidebar", BoolSetting True)
    , ("topbar", BoolSetting True)
    , ("footer", BoolSetting True)
    , ("pager", BoolSetting True)
    ]

blank_package : Package
blank_package =
    { settings = Dict.empty
    , content = []
    , themes = []
    }

blank_contentitem : ContentItem
blank_contentitem = 
    { settings = (Dict.empty)
    , type_ = Chapter
    }

blank_model : Model
blank_model = 
    { localisations = Dict.empty
    , tab = PackageSettingsTab
    , package = blank_package
    , files = Tree.singleton { type_ = FS.Directory, name = "" }
    , media_root = ""
    , err = Nothing
    }

load_model : JD.Value -> Model
load_model flags = case JD.decodeValue decode_flags flags of
    Ok m -> m
    Err err -> { blank_model | err = Just <| JD.errorToString err }

decode_flags : JD.Decoder Model
decode_flags =
    JD.map3
        (\files package media_root->
            { blank_model | package = package, files = files, media_root = media_root }
        )
        (JD.field "files" FS.decode)
        (JD.field "config" decode_package)
        (JD.field "media_root" JD.string)

init : JD.Value -> (Model, Cmd Msg)
init flags = (load_model flags, Cmd.none)

{- Convenience function to return a model along with no command, to be returned by the update function -}
nocmd model = (model, Cmd.none)

{- The index of the last item in a list -}
last_index : List a -> Int
last_index = List.length >> (+) -1

{- Get the function to move a content item in the given direction. -}
move_item : ListDirection -> FP.ForestPath -> Forest ContentItem -> (Forest ContentItem, Maybe FP.ForestPath)
move_item direction =
    case direction of
        Up -> move_up
        Down -> move_down
        Right -> move_right item_has_children

{- Top-level model update -}
update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
    FocusButton _ -> model |> nocmd

    ItemMsg (Move direction button_id) path ->
        let
            package = model.package
            (ncontent, npath) = move_item direction path package.content
            tab = npath |> Maybe.map ContentItemTab |> Maybe.withDefault model.tab
        in
            ({ model | package = { package | content = ncontent }, tab = tab }, Task.attempt FocusButton (Browser.Dom.focus button_id))

    ItemMsg Delete path ->
        let
            npackage = delete_item path model.package
            tab = case model.tab of
                ContentItemTab p2 -> if p2 == path then PackageSettingsTab else model.tab
                _ -> model.tab
        in
            { model | package = npackage, tab = tab } |> nocmd

    ItemMsg item_msg path -> { model | package = update_item path (apply_item_msg item_msg) model.package  } |> nocmd

    AddItem mpath type_ -> 
        case mpath of
            Just path -> 
                let
                    npackage = add_item path type_ model.package
                    npath = FN.to path npackage.content |> Maybe.map (Tree.children >> last_index >> (\i -> FP.toChild i path) >> ContentItemTab)
                    tab = Maybe.withDefault model.tab npath
                in
                    { model | package = npackage, tab = tab } |> nocmd

            Nothing ->
                let
                    npackage = add_top_item type_ model.package
                in
                    { model | package = npackage, tab = ContentItemTab (FP.fromIndex (last_index npackage.content) TP.atTrunk) } |> nocmd

    SetTab tab -> { model | tab = tab } |> nocmd

    SetPackageSetting path key setting -> { model | package = set_package_setting path key setting model.package } |> nocmd

set_package_setting : List String -> String -> Setting -> Package -> Package
set_package_setting whole_path key setting package = 
    let 
        visit : SettingsDict -> List String -> SettingsDict
        visit settings path = case path of
            [] -> Dict.insert key setting settings
            a::rest -> case Dict.get a settings of
                Just (DictSetting s) -> Dict.insert a (DictSetting (visit s rest)) settings
                Nothing -> Dict.insert a (DictSetting (visit (Dict.empty) rest)) settings
                _ -> settings
    in
        { package | settings = visit package.settings whole_path }

{- Update an item with the result of `fn`. -}
update_item : ItemPath -> (Tree ContentItem -> Tree ContentItem) -> Package -> Package
update_item path fn package = {package | content = FN.alter path fn package.content }

{- Apply an `ItemMsg` to the given content item. -}
apply_item_msg : ItemMsg -> Tree ContentItem -> Tree ContentItem
apply_item_msg msg tree = case msg of
    SetType type_ -> tree |> Tree.mapLabel (\item -> { item | type_ = type_ })
    SetSetting key setting -> tree |> Tree.mapLabel (\item -> { item | settings = Dict.insert key setting item.settings })

    {- These messages are handled by the top-level update function -}
    Move _ _ -> tree
    Delete -> tree


{- Add a blank item somewhere inside the package structure. -}
add_item : ItemPath -> ContentItemType -> Package -> Package
add_item path type_ package = { package | content = FN.alter path (Tree.appendChild (Tree.singleton { blank_contentitem | type_ = type_ })) package.content }

{- Delete an item from the package structure. -}
delete_item path package = { package | content = FN.remove path package.content }

{- Add an item to the top level of the package structure. -}
add_top_item : ContentItemType ->Package -> Package
add_top_item type_ package = { package | content = package.content ++ [Tree.singleton { blank_contentitem | type_ = type_ }] }

{- Get a setting from a settings dictionary, returning the default value, or as a final fallback the empty string. -}
get_setting : SettingsDict -> SettingsDict -> String -> Setting
get_setting defaults settings key =
       Dict.get key settings
    |> Maybe.andThen (\s -> case s of
        IntSetting i -> if isNaN (toFloat i) then Nothing else Just s
        _ -> Just s
       )
    |> Maybe.withDefault (Maybe.withDefault (StringSetting "") <| Dict.get key defaults)

{- A function which takes a dictionary of default values, a settings dictionary, and a key and returns a setting of the given type.
   These return a default value if the saved setting is not of the right type.
-}
type alias SettingGetter setting = SettingsDict -> SettingsDict -> String -> setting

{- A function which converts a general setting to another type. -}
type alias MapSetting a = Setting -> a

{- Helper function for making setting getters.
   Get the given setting, then convert it to the required type.
-}
map_setting : MapSetting a -> SettingGetter a
map_setting fn defaults object key = get_setting defaults object key |> fn

{- Helper function for making setting getters which also return the default value in a pair.
   Used by `get_string_setting_or_default` to return the default value when the setting is present but set to the empty string.
-}
map_setting_and_default : ((Maybe Setting, Maybe Setting) -> a) -> SettingsDict -> SettingsDict -> String -> a
map_setting_and_default fn defaults object key = fn (Dict.get key object , Dict.get key defaults)

string_setting : MapSetting String
string_setting setting = case setting of
    StringSetting s -> s
    _ -> ""

bool_setting : MapSetting Bool
bool_setting setting = case setting of
    BoolSetting b -> b
    _ -> False

int_setting : MapSetting Int
int_setting setting = case setting of
    IntSetting i -> i
    _ -> 0

list_setting : (MapSetting a) -> MapSetting (List a)
list_setting item setting = case setting of
    ListSetting l -> List.map item l
    _ -> []

dict_setting : MapSetting (Dict String Setting)
dict_setting setting = case setting of
    DictSetting d -> d
    _ -> Dict.empty

get_string_setting : SettingGetter String
get_string_setting = map_setting string_setting

{- Get a string setting and return the default value if it's missing or the empty string `""`. -}
get_string_setting_or_default = 
    map_setting_and_default 
        (\(setting, default) -> case (setting,default) of
            (Just (StringSetting ""), Just (StringSetting d)) -> d
            (Just (StringSetting s), _) -> s
            (_, Just (StringSetting d)) -> d
            _ -> ""
        )

get_bool_setting : SettingGetter Bool
get_bool_setting = map_setting bool_setting

get_int_setting : SettingGetter Int
get_int_setting = map_setting int_setting

{- Can this item have children? True only for "Part" items. -}
item_has_children : ContentItem -> Bool
item_has_children item = case item.type_ of
    Part -> True
    _ -> False

{- If the item can have children, return the list of children. If it can't have children, return `Nothing`. -}
item_children : Tree ContentItem -> Maybe (List (Tree ContentItem))
item_children tree = if item_has_children (Tree.label tree) then Just (Tree.children tree) else Nothing

{- A readable name for an item type. -}
item_type_name : ContentItemType -> String
item_type_name type_ = case type_ of
    Introduction -> localise "Introduction"
    Part -> localise "Part"
    Document -> localise "Document"
    Chapter -> localise "Chapter"
    Standalone -> localise "Standalone"
    URL -> localise "URL"
    HTML -> localise "HTML"
    Slides -> localise "Slides"
    Exam -> localise "Exam"
    Notebook -> localise "Notebook"

{- The string code for an item type to use in the config file -}
item_type_code : ContentItemType -> String
item_type_code type_ = case type_ of
    Introduction -> "introduction"
    Part -> "part"
    Document -> "document"
    Chapter -> "chapter"
    Standalone -> "standalone"
    URL -> "url"
    HTML -> "html"
    Slides -> "slides"
    Exam -> "exam"
    Notebook -> "notebook"

code_to_item_type : String -> ContentItemType
code_to_item_type s = content_item_types |> List.filter (\x -> item_type_code x == s) |> List.head |> Maybe.withDefault Chapter

{- The top-level view function.
   Shows a loading error if there was one, otherwise the config form.
-}
view model = case model.err of
    Just err -> 
        H.p
            [ HA.id "loading-error" ]
            [ H.text err ]

    Nothing -> form model

{- The form for editing the package.
   The JSON rendering of the data is stored in a hidden input with id `id_config`.
-}
form : Model -> Html Msg
form model =
    H.form
        [ HA.id "config-form"
        , HA.method "POST"
        , HA.enctype "multipart/form-data"
        ]
        [ H.div
            [ HA.id "app" ]
            [ H.nav 
                [ HA.id "main-nav" ]
                [ H.button 
                    [ HA.class "action", HA.type_ "submit" ]
                    [ text "Save" ]

                , structure_tree model
                ]
            , case model.tab of
                PackageSettingsTab -> package_settings_tab model
                ContentItemTab path -> case FN.to path model.package.content of
                    Just t -> item_settings_tab model path t
                    Nothing -> div [] [ text "Oh no!" ]
                CreateItemTab path -> create_item_tab path
            ]

        , H.input
            [ HA.type_ "hidden"
            , HA.id "id_config"
            , HA.name "config"
            , HA.value (JE.encode 0 (encode_package model.package))
            ]
            []
        ]

{- Options for the package's language.
   This should match the available translations for the theme.
-}
locale_options =
    [ ("en", "English")
    ]

form_generator model setting_getter msg = 
    let
        pcontrol : Form.GenericControl input output Setting Msg
        pcontrol = Form.render setting_getter msg

        text_input : Form.Control String String Msg
        text_input = pcontrol string_setting StringSetting Form.text_input

        textarea: Form.Control String String Msg
        textarea = pcontrol string_setting StringSetting Form.textarea

        comma_list : Form.Control String String Msg
        comma_list = 
            pcontrol 
                (list_setting string_setting >> String.join ",") 
                (String.split "," >> List.map String.trim >> (\x -> if List.all ((==) "") x then [] else x) >> List.map StringSetting >> ListSetting)
                Form.text_input

        select : Form.SelectOptions -> Form.Control String String Msg
        select options = pcontrol string_setting StringSetting (Form.select options)

        int_input : Form.Control Int Int Msg
        int_input = pcontrol int_setting IntSetting Form.int_input

        bool_checkbox : Form.Control Bool Bool Msg
        bool_checkbox = pcontrol bool_setting BoolSetting Form.bool_checkbox

        file_selector : FS.FileFilter -> Form.Control String String Msg
        file_selector valid_files = pcontrol string_setting StringSetting (Form.file_selector (FS.filter valid_files model.files))

    in
        { pcontrol = pcontrol
        , text_input = text_input
        , textarea = textarea
        , comma_list = comma_list
        , select = select
        , int_input = int_input
        , bool_checkbox = bool_checkbox
        , file_selector = file_selector
        }

{- The editor tab for global package settings. -}
package_settings_tab : Model -> Html Msg
package_settings_tab model =
    let
        package = model.package

        package_setting : String -> Setting
        package_setting key = get_setting package_defaults package.settings key
        
        license : Dict String Setting
        license = package_setting "license" |> dict_setting

        license_setting : String -> Setting
        license_setting key = Dict.get key license |> Maybe.withDefault (StringSetting "")

        p = form_generator model package_setting (SetPackageSetting [])

        l = form_generator model license_setting (SetPackageSetting ["license"])
    in
        H.section
            [ HA.id "package-settings"
            , role "tabpanel"
            ]
            [ H.fieldset
                []
                (  [ H.legend [] [ text "Package metadata" ] ]
                ++ (p.text_input identity "title" "Title")
                ++ (p.text_input identity "author" "Author")
                ++ (p.text_input identity "institution" "Institution")
                ++ (p.text_input identity "code" "Course code")
                ++ (p.text_input identity "year" "Year")
                ++ (p.select locale_options identity "locale" "Language")
                )

            , H.fieldset
                []
                (  [ H.legend [] [ text "Licence" ] ]
                ++ (l.text_input identity "name" "Licence name")
                ++ (l.text_input identity "url" "Licence URL")
                ++ (l.text_input identity "year" "Copyright year")
                ++ (l.text_input identity "by" "Copyright attribution")
                )

            , H.fieldset
                []
                (  [ H.legend [] [ text "Build options" ] ]
                ++ (p.bool_checkbox identity "build_pdf" "Build PDFs?")
                ++ (p.bool_checkbox identity "build_zip" "Build zip of entire package?")
                ++ (Form.visible_if (package_setting "build_pdf" |> bool_setting) <| p.pcontrol int_setting IntSetting Form.int_input identity "num_pdf_runs" "Number of PDF runs")
                ++ (p.text_input identity "mathjax_url" "URL to load MathJax from")
                ++ (p.comma_list identity "css" "Extra CSS files")
                ++ (p.comma_list identity "js" "Extra JavaScript files")
                )
            ]

{- Filter out files whose extensions aren't in the list `valid_extensions`. -}
file_extension_filter : List String -> FS.FileFilter
file_extension_filter valid_extensions i = i.type_ == FS.Directory || List.member (FS.extension i) valid_extensions

{- Filter out files which aren't images. -}
is_image_file = file_extension_filter [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".jxl"]

{- Valid file extensions for source files for this item's type. -}
source_extensions : ContentItem -> List String
source_extensions item = case item.type_ of
    HTML -> [".html", ".htm"]
    _ -> [".tex", ".md"]

{- The editor tab for a content item. -}
item_settings_tab : Model -> ItemPath -> Tree ContentItem -> Html Msg
item_settings_tab model path tree =
    let
        item : ContentItem
        item = Tree.label tree

        item_setting : String -> Setting
        item_setting key = get_setting item_defaults item.settings key

        p = form_generator model item_setting (\id s -> ItemMsg (SetSetting id s) path)

        item_type_options : Form.SelectOptions
        item_type_options = List.map (\t -> (item_type_code t, item_type_name t)) content_item_types

        type_select : List (Html Msg)
        type_select =
            Form.render 
                (\_ -> item.type_)
                (\_ t -> ItemMsg (SetType t) path)
                item_type_code
                code_to_item_type
                (Form.select item_type_options)
                identity
                "type"
                "Type"

        is_source_file : FS.FileFilter
        is_source_file = file_extension_filter <| source_extensions item

        source_input : List (Html Msg)
        source_input = case item.type_ of
            URL -> p.text_input (Form.with_hint (text "A URL")) "source" "URL"
            HTML -> p.textarea identity "html" "HTML code"
            _ -> p.file_selector is_source_file identity "source" "Source"


        {- Add a preview to a form control whose value is a filename that might refer to an image. -}
        image_preview : Form.FormControlElement String String Msg -> Form.FormControlElement String String Msg
        image_preview element control value =
               element control value
            |>  if value == "" then 
                    identity 
                else
                    Form.add_input
                        ( H.img
                            [ HA.src <| model.media_root ++ value
                            , HA.class "thumbnail"
                            , HA.alt "Thumbnail"
                            ]
                            []
                        )

        {- Can a PDF of this item be built? -}
        can_build_pdf : Bool
        can_build_pdf = case item.type_ of
            URL -> False
            HTML -> False
            Part -> False
            _ -> True

        {- Options for the "document split level" setting. -}
        splitlevel_options : List (Int, String)
        splitlevel_options =
            [ (-2, "Entire document (no splitting)")
            , (-1, "Part")
            , (0, "Chapter")
            , (1, "Section")
            , (2, "Subsection")
            ]

        {- The select box for the "document split level" setting. -}
        splitlevel_select : List (Html Msg)
        splitlevel_select = 
             p.pcontrol
                (int_setting >> String.fromInt)
                (String.toInt >> Maybe.withDefault 0 >> IntSetting)
                (splitlevel_options |> List.map (Tuple.mapFirst String.fromInt) |> Form.select)
                identity
                "splitlevel"
                "Split at"

        {- The ID of the button for this item in the structure tree. -}
        button_id : String
        button_id = structure_button_id item

        move_button direction =
            H.button
                [ HE.onClick (ItemMsg (Move direction button_id) path)
                , HA.type_ "button"
                , HA.disabled (move_item direction path model.package.content |> Tuple.second |> (==) Nothing)
                ]
                [ text <| case direction of
                    Up -> "↑"
                    Down -> "↓"
                    Right -> "→"
                ]

    in
        H.section
            [ HA.id "current-item"
            , role "tabpanel"
            ]
            [ H.nav
                [ HA.id "item-nav" ]
                [ H.div
                    [ HA.id "move-buttons" ]
                    [ H.text "Move this item"
                    , move_button Up
                    , move_button Down
                    , move_button Right
                    ]

                , H.button
                    [ HA.class "delete"
                    , HA.type_ "button"
                    , HE.onClick (ItemMsg Delete path)
                    ]
                    [ text "Delete this item" ]
                ]
                
            , H.fieldset
                []
                (  [ H.legend [] [ text "Metadata" ] ]
                ++ (type_select)
                ++ (p.text_input (Form.with_placeholder "Unnamed item") "title" "Title")
                ++ (p.text_input identity "slug" "Slug")
                ++ (p.text_input identity "author" "Author")
                )
            
            , H.fieldset
                []
                (   [ H.legend [] [ text "Source" ] ]
                 ++ (source_input)
                 ++ (p.file_selector is_image_file image_preview "thumbnail" "Thumbnail image")
                 ++ (if item.type_ /= Document then [] else splitlevel_select)
                )

            , H.fieldset
                []
                (   [ H.legend [] [ text "Display options" ] ]
                 ++ (p.bool_checkbox identity "is_hidden" "Hidden?")
                 ++ (Form.visible_if can_build_pdf <|
                        (p.bool_checkbox identity "build_pdf" "Build PDF?")
                     ++ (Form.visible_if (item_setting "build_pdf" |> bool_setting) <| p.text_input identity "pdf_url" "PDF URL")
                    )
                 ++ (p.bool_checkbox identity "sidebar" "Show the sidebar?")
                 ++ (p.bool_checkbox identity "topbar" "Show the top bar?")
                 ++ (p.bool_checkbox identity "footer" "Show the footer?")
                 ++ (p.bool_checkbox identity "pager" "Show the pager?")
                 ++ (p.comma_list identity "css" "Extra CSS files")
                 ++ (p.comma_list identity "js" "Extra JavaScript files")
                )
            ]

 {- The editor tab for creating a new item. -}
create_item_tab : Maybe ItemPath -> Html Msg
create_item_tab path =
    let
        type_selector type_ description =
            H.li
                [ HA.class "item-type" ]
                [ H.button
                    [ HE.onClick <| AddItem path type_
                    , HA.type_ "button"
                    ]
                    [ text <| item_type_name type_ ]
                , H.span
                    [ HA.class "input-hint" ]
                    [ text description ]
                ]
    in
        H.section
            [ HA.id "create-item"
            , role "tabpanel"
            ]
            [ H.h2 [] [ text "Adding a new item" ]
            , H.p 
                [ HA.class "input-hint" ]
                [ text "Select a type for this item." ]
            , H.ul
                []
                [ type_selector Introduction "The index page for the course."
                , type_selector Part "A group of items."
                , type_selector Chapter "A single document, or a chapter from a longer document."
                , type_selector Document "A single document, automatically split into separate pages."
                , type_selector Standalone "A single document with no links to other items."
                , type_selector Slides "Slides for presentation."
                , type_selector Notebook "A code notebook, with an automatically-created Jupyter notebook version."
                , type_selector URL "A link to a given address."
                , type_selector HTML "A single passage of HTML code."
                ]
            ]
    

{- A button to add an item. The position is determined by the `msg`. -}
add_item_button : Model -> Maybe ItemPath -> Html Msg
add_item_button model path = 
    H.li
        []
        [ if model.tab == CreateItemTab path then
            H.span
                [ HA.class "adding-item" ]
                [ text "Adding an item" ]
          else
            H.button
                [ HA.class "action add-item"
                , HA.type_ "button"
                , HE.onClick (SetTab (CreateItemTab path))
                ]
                [ text "+ Add an item"
                ]
        ]

{-  The `id` attribute for the button corresponding to the given item in the structure navigation.
    The value has to depend only on the item's content, not its position in the structure, so it won't be unique if two items have the same type and title.
-}
structure_button_id item = (item_type_code item.type_)++"-"++(get_string_setting_or_default item_defaults item.settings "title")++"-structure-button"

{- The tree of the package's structure, displayed in the nav sidebar. -}
structure_tree : Model -> Html Msg
structure_tree model =
    let
        {- Handle a keypress on a button corresponding to a content item, moving it in the list of shift and an arrow key are pressed. -}
        move_keypress : FP.ForestPath -> String -> JD.Decoder { message : Msg, stopPropagation : Bool, preventDefault : Bool }
        move_keypress path id =
            JD.field "shiftKey" JD.bool
            |> JD.andThen (\s -> if s then JD.field "key" JD.string else JD.fail "shift not pressed")
            |> JD.andThen (\key -> 
                case key of
                    "ArrowUp" -> JD.succeed Up
                    "ArrowDown" -> JD.succeed Down
                    "ArrowRight" -> JD.succeed Right
                    _ -> JD.fail "not a key I'm interested in"
               )
            |> JD.map (\dir -> {message = ItemMsg (Move dir id) path, stopPropagation = True, preventDefault = True })

        {- The part of the structure display corresponding to a single item.
            A button to select that item, and a list of its children, if any.
        -}
        structure_single_item : Int -> { path : TP.TreePath, label: ContentItem, children : List (Html Msg) } -> Html Msg
        structure_single_item i sub = 
            let
                path = FP.fromIndex i sub.path
                item = sub.label
                has_children = item_has_children sub.label
                this_tab = ContentItemTab path
                title = get_string_setting_or_default item_defaults item.settings "title"
                button_id = structure_button_id item
            in
                H.li
                    [ role "presentation" 
                    ]

                    ([ H.button
                        ([ HA.type_ "button"
                         , HA.class "item"
                         , HA.id <| button_id
                         , role "tab"
                         , HE.onClick <| SetTab this_tab
                         , HE.custom "keydown" (move_keypress path button_id)
                         ]
                         ++(aria_expanded <| not <| List.isEmpty sub.children && has_children)
                         ++(aria_current <| model.tab == this_tab)
                        )
                        [ H.span
                            [ HA.class "item-type" ]
                            [ H.text <| item_type_name item.type_ ]
                        , H.br [] []
                        , H.text title
                        ]
                     ]
                     ++(if has_children then
                            [H.ul
                                [ HA.class "content"
                                ]
                                (  sub.children 
                                ++ [ H.li [] [ add_item_button model (Just path) ] ]
                                )
                            ]
                        else
                            []
                    ))

        {- The display of an entire tree.
            The package's content is a forest of these trees.
        -}
        structure_item_tree : Int -> Tree ContentItem -> Html Msg
        structure_item_tree i tree =
            tree |> TN.restructure (structure_single_item i)

    in
        H.ul
            [ role "tree"
            , HA.id "structure-tree"
            ]

            [ H.li
                [ role "presentation"
                ]
                [ H.button
                    ([ role "tab"
                    , HA.type_ "button"
                    , HE.onClick <| SetTab PackageSettingsTab
                    ]++(aria_expanded <| not <| List.isEmpty model.package.content)
                     ++(aria_current <| model.tab == PackageSettingsTab)
                    )
                    [ text "Package settings" ]

                , H.ul
                    [ role "tree"
                    ]

                    (((List.indexedMap structure_item_tree model.package.content)
                    )++
                    [ add_item_button model Nothing
                    ])
                ]
            ]


encode_package : Package -> JE.Value
encode_package package = 
    JE.object
        (  (encode_settings package.settings)
        ++ [ ("structure", JE.list encode_content_item package.content) ]
        )

encode_content_item : Tree ContentItem -> JE.Value
encode_content_item tree =
    let
        item = Tree.label tree
        children = item_children tree
    in
        JE.object
            ([ ("type", JE.string <| item_type_code item.type_)
             ]
             ++(Maybe.map (\c -> [("content", JE.list encode_content_item c)]) children |> Maybe.withDefault [])
             ++(encode_settings item.settings)
            )

encode_settings : SettingsDict -> List (String, JE.Value)
encode_settings settings = (Dict.map (\_ -> encode_setting) settings |> Dict.toList)

encode_setting : Setting -> JE.Value
encode_setting setting = case setting of
    StringSetting s -> JE.string s
    IntSetting i -> JE.int i
    BoolSetting b -> JE.bool b
    DictSetting d -> JE.dict identity encode_setting d
    ListSetting l -> JE.list encode_setting l


decode_package : JD.Decoder Package
decode_package = 
    JD.map2
        (\content settings ->
            { content = content
            , settings = settings
            , themes = []
            }
        )
        (JD.field "structure" (JD.list decode_content_item))
        (decode_settings)

decode_content_item : JD.Decoder (Tree ContentItem)
decode_content_item =
    JD.map3
        (\type_ mcontent settings ->
            let
                item =
                    { type_ = type_
                    , settings = settings
                    }
            in
                case mcontent of
                    Just content -> Tree.tree item content
                    Nothing -> Tree.singleton item
        )
        (JD.field "type" JD.string |> JD.map code_to_item_type)
        (JD.field "content" (JD.list (JD.lazy (\_ ->decode_content_item))) |> JD.maybe)
        (decode_settings)

decode_settings : JD.Decoder SettingsDict
decode_settings =
       JD.dict decode_setting
    |> JD.map (Dict.filter (\k v -> not (List.member k ["content", "type"]) && v /= Nothing))
    |> JD.map (Dict.map (\_ -> Maybe.withDefault (StringSetting "")))

decode_setting : JD.Decoder (Maybe Setting)
decode_setting = 
        JD.oneOf
            [ JD.int |> JD.map IntSetting
            , JD.string |> JD.map StringSetting
            , JD.bool |> JD.map BoolSetting
            , JD.dict (JD.lazy (\_ -> decode_setting)) |> JD.map (Dict.toList >> List.filterMap (\(k,mv) -> Maybe.map (pair k) mv) >> Dict.fromList) |> JD.map DictSetting
            , JD.list (JD.lazy (\_ -> decode_setting)) |> JD.map (List.filterMap identity) |> JD.map ListSetting
            ]
    |> JD.maybe
