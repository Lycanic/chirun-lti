module Form exposing (..)

{-  A grammar for form controls.
    The general idea is that each control consists of a label element and one or more elements representing the input.
    Combinators can add elements to the label or input lists, or change attributes for the control.
    There are three data types in addition to the Elm msg type, relating to the value the control represents:
    * The type that the value is stored as in the Elm model.
    * The type that the control can take in.
    * The type that the control produces.
-}

import FS exposing (FileTree, FSItem, FileType(..))
import Html as H exposing (Html, div)
import Html.Attributes as HA
import Html.Events as HE
import Html.ChirunExtra exposing (..)
import Json.Decode as JD
import Json.Encode as JE
import List.Extra
import Tree exposing (Tree)
import Tree.Navigate as TN
import Tree.Path as TP
import Tuple exposing (pair, first)

{- The label and input elements for a control. -}
type alias ControlElements msg = {label : List (Html msg), input : List (Html msg)}

{- A constructor for a form control. Take:
    * a definition comprising an `id` attribute, a function which produces an Elm message when the value changes, and a list of HTML attributes to apply to the control
    * the current value of the control
   Returns a record with a list of label elements and a list of input elements.
-}
type alias FormControlElement output input msg = {id : String, onInput : output -> msg, attr : input -> List (H.Attribute msg) } -> input -> ControlElements msg

{- A generic control whose input, output and storage types are defined.
   A function which takes:
    * A function for converting the stored value into a value the control can display.
    * A function for converting the output value into a value to be stored.
    * A constructor for a form control.
   and returns a `Control`
-}
type alias GenericControl input output store msg = (store -> input) -> (output -> store) -> FormControlElement output input msg -> Control input output msg

{- A function to make a control. Takes:
    * A function for modifying the generic control.
    * The ID of the control.
    * The text label.
   and returns a list of HTML elements.
-}
type alias Control input output msg = (FormControlElement output input msg -> FormControlElement output input msg) -> String -> String -> List (Html msg)

{- 
    Options for a `<select>` element.
    Pairs of the form (value, display)
-}
type alias SelectOptions = List (String, String)

just_label : Html msg -> ControlElements msg
just_label element = { label = [element], input = [] }

just_input : Html msg -> ControlElements msg
just_input element = { label = [], input = [element] }

add_label : Html msg -> ControlElements msg -> ControlElements msg
add_label element o = { o | label = o.label ++ [element] }

add_input : Html msg -> ControlElements msg -> ControlElements msg
add_input element o = { o | input = o.input ++ [element] }


{- If more than one element is given, wrap them all in a `<div>`, otherwise return a single element unmodified. -}
wrap_multiple elements = case elements of
    [] -> []
    x::[] -> [x]
    _ -> [div [] elements]

text_input : FormControlElement String String msg
text_input control value =
    just_input
    <| H.input
        (   [ HA.type_ "text"
            , HA.id control.id
            , HE.onInput control.onInput
            , HA.value value
            ]
         ++ (control.attr value)
        )
        []

textarea : FormControlElement String String msg
textarea control value =
    just_input
    <| H.textarea
        (   [ HA.id control.id
            , HE.onInput control.onInput
            ]
         ++ (control.attr value)
        )
        [ H.text value ]

select : SelectOptions -> FormControlElement String String msg
select options control value =
    just_input
    <| H.select
        (   [ HE.onInput control.onInput
            , HA.id control.id
            ]
         ++ (control.attr value)
        )
        (List.map (\(option, option_label) ->
            H.option
                [ HA.value option
                , HA.selected <| value == option
                ]
                [ H.text option_label ]
        ) options)

int_input : FormControlElement Int Int msg
int_input control value =
    just_input
    <| H.input
        (   [ HA.id control.id
            , HA.type_ "number"
            , HE.on "input" (JD.map control.onInput (JD.field "target" (JD.field "valueAsNumber" JD.int))) 
            , HA.value (String.fromInt value)
            ]
         ++ (control.attr value)
        )
        []

bool_checkbox : FormControlElement Bool Bool msg
bool_checkbox control value =
    just_input
    <| H.input 
        (   [ HA.id control.id
            , HA.type_ "checkbox"
            , HA.checked value
            , HE.onCheck control.onInput
            ]
         ++ (control.attr value)
        )
        []

{- Given the parts of a path in the file system, and the file system, return a `TP.TreePath` object to that file, if it's there. -}
pathnames_to_path : List String -> FileTree -> Maybe (TP.TreePath)
pathnames_to_path pathnames tree = case pathnames of
    [] -> Just (TP.atTrunk)
    pathname::rest -> 
            Tree.children tree |> List.indexedMap pair  |> List.Extra.find (\(i,t) -> (Tree.label t |> .name) == pathname)
        |>  Maybe.andThen (\(i,sub) -> 
                case (Tree.label sub |> .type_, rest) of
                    (File, []) -> Just [i]
                    (File, _) -> Nothing
                    (Directory, _) -> Maybe.map ((::) i) (pathnames_to_path rest sub)
            )

 {- Given a `TP.TreePath` to a file and a file system, return the parts of that file's full path. -}
path_to_pathnames : TP.TreePath -> FileTree -> List String
path_to_pathnames path files =
    let
        name = Tree.label files |> .name
    in
        case path of
            [] -> if name == "" then [] else List.singleton name
            i::rest -> case Tree.children files |> List.Extra.getAt i of
                Just sub -> 
                    let
                        subnames = path_to_pathnames rest sub
                    in
                        if name == "" then subnames else name::subnames
                Nothing -> []


file_selector : FileTree -> FormControlElement String String msg
file_selector files control value =
    let
        filepath = String.split "/" value
        mpath = pathnames_to_path filepath files

        show_item : { path : TP.TreePath, label: FSItem, children : List (Html msg) } -> Html msg
        show_item sub =
            let
                path = sub.path
                name = sub.label.name
                selected = mpath == Just path
                in_selected = path /= [] && (mpath |> Maybe.withDefault [] |> \p -> (List.take (List.length path) p) == path)
            in
                (case sub.label.type_ of
                    Directory -> 
                        H.details
                            (   [ HA.classList
                                    [ ("directory-tree", True)
                                    , ("selected", selected)
                                    ]
                                , role "tree"
                                ]
                             ++ (optional_attribute "open" in_selected)
                            )
                            [ H.summary
                                []
                                (case path of
                                    [] -> 
                                        if value == "" then
                                            [ H.text "Select a file" ]
                                        else
                                            [ H.code [ HA.class "file-path" ] [ H.text value ] ]

                                    _ ->[ H.text name ]
                                )
                            , H.ul
                                []
                                (if List.isEmpty sub.children then
                                    [ H.li [ HA.class "empty-directory text-muted" ] [ H.text "Empty directory" ] ]
                                 else
                                    sub.children
                                )
                            ]
                        |> \e -> if path == [] then e else H.li [ HA.class "directory" ] [ e ]
                    File -> 
                        H.li
                            [ HA.class "file" ]
                            [ H.button
                                (   [ HA.type_ "button"
                                    , HA.classList
                                        [ ("selected", selected)
                                        , ("file", True)
                                        ]
                                    , HE.onClick <| control.onInput <| String.join "/" <| path_to_pathnames path files
                                    ]
                                 ++ (aria_current selected)
                                )
                                [ H.text name ]
                            ]
                )
    in
           files 
        |> TN.restructure show_item
        |> just_input

{- Prefix the ID of a control with the given string. -}
prefix_control : String -> FormControlElement a b msg -> FormControlElement a b msg
prefix_control prefix element = \control -> element { control | id = prefix++"-"++control.id }

{- Add a label to a control. -}
labelled : String -> FormControlElement a b msg -> FormControlElement a b msg
labelled label element control value =
       element control value
    |> \o -> 
        o|> if o.input == [] then identity else 
            add_label (
                H.label
                    [ HA.for control.id ]
                    [ H.text label ]
            )

{- If `visible` is false, don't display these elements. -}
visible_if : Bool -> List (Html msg) -> List (Html msg)
visible_if visible elements = if visible then elements else []

{- Add a `placeholder` attribute to an input. -}
with_placeholder : String -> FormControlElement a b msg -> FormControlElement a b msg
with_placeholder placeholder element control =
    element
        { control | attr = \v -> (HA.placeholder placeholder)::(control.attr v) }

{- Display a line of hint text under an input. -}
with_hint : Html msg -> FormControlElement a b msg -> FormControlElement a b msg
with_hint hint element control value =
       element control value
    |> add_input (H.p [HA.class "input-hint"] [hint])

{- Render a control element, given all the necessary pieces:
    * A function to get the value from storage, using the given key.
    * A function to produce a message to store the new value, using the given key and a value produced by the control.
    * A function to map values from storage to the control's input type.
    * A function to map the control's output type to the storage type.
    * The base form control.
    * A function to modify the base form control.
    * The control's ID.
    * The control's displayed label.
-}
render : 
    (String -> store) -- getter
    -> (String -> store -> msg) -- store_msg
    -> (store -> input) -- map_store_to_input
    -> (output -> store) -- map_output_to_store
    -> FormControlElement output input msg -- element
    -> (FormControlElement output input msg -> FormControlElement output input msg) -- map_element
    -> String -- id
    -> String -- label
    -> List (Html msg)
render getter store_msg map_store_to_input map_output_to_store element map_element id label = 
    (element |> labelled label |> map_element)
        { id = id, onInput = map_output_to_store >> store_msg id, attr = \_ -> [] }
        (getter id |> map_store_to_input)
    |> \c -> (wrap_multiple c.label)++(wrap_multiple c.input)

