from typing import Any
from django.contrib import admin
from django.db.models import Max
from django.utils.translation import gettext_lazy as _

from django.utils import timezone
from datetime import timedelta

from .models import ChirunPackage, PackageLTIUse

class LastCompiledListFilter(admin.SimpleListFilter):
    # Human-readable splitting of last compile times
    title = _("last compiled")
    parameter_name = "compile_threshold"

    def lookups(self, request, model_admin):
        return [
            ("na", _("never built")),
            ("<1d", _("within the last day")),
            ("<7d", _("within the last week")),
            ("<30d", _("within the last month")),
            (">30d", _("more than 30 days ago")),
            (">1y", _("more than a year ago")),
        ]

    def queryset(self, request, queryset):
        if self.value() == "na":
            return queryset.filter(
                last_compiled_sort__isnull = True
                )
        if self.value() == "<1d":
            return queryset.filter(
                last_compiled_sort__gte = timezone.now() - timedelta(days = 1)
                )
        if self.value() == "<7d":
            return queryset.filter(
                last_compiled_sort__gte = timezone.now() - timedelta(days = 7)
                )
        if self.value() == "<30d":
            return queryset.filter(
                last_compiled_sort__gte = timezone.now() - timedelta(days = 30)
                )
        if self.value() == ">30d":
            return queryset.filter(
                last_compiled_sort__lte = timezone.now() - timedelta(days = 30)
                )
        if self.value() == ">1y":
            return queryset.filter(
                last_compiled_sort__lte = timezone.now() - timedelta(days = 365)
                )

class LastLaunchedListFilter(admin.SimpleListFilter):
    # Human-readable splitting of last compile times
    title = _("last launched")
    parameter_name = "launch_threshold"

    def lookups(self, request, model_admin):
        return [
            ("na","never launched"),
            ("<7d","within the last week"),
            ("<30d", "within the last 30 days"),
            (">30d", "more than 30 days ago"),
            (">1y", "more than a year ago"),
            (">3y", "more than three years ago"),
        ]
    def queryset(self, request, queryset):
        if self.value() == "na":
            return queryset.filter(
                last_launched_sort__isnull = True
                )
        if self.value() == "<7d":
            return queryset.filter(
                last_launched_sort__gte = timezone.now() - timedelta(days = 7)
                )
        if self.value() == "<30d":
            return queryset.filter(
                last_launched_sort__gte = timezone.now() - timedelta(days = 30)
                )
        if self.value() == ">30d":
            return queryset.filter(
                last_launched_sort__lte = timezone.now() - timedelta(days = 30)
                )
        if self.value() == ">1y":
            return queryset.filter(
                last_launched_sort__lte = timezone.now() - timedelta(days = 365)
                )
        if self.value() == ">3y":
            return queryset.filter(
                last_launched_sort__lte = timezone.now() - timedelta(days = 1096)
                )

class GitExistsListFilter(admin.SimpleListFilter):
    title = _("git connection")
    parameter_name = "git_linked"
    def lookups(self,request,model_admin):
        return [
            ("false","not connected"),
            ("true","connected")
        ]
    def queryset(self,request,queryset):
        if self.value() == "false":
            return queryset.filter(git_url = "")
        if self.value() == "true":
            return queryset.exclude(git_url = "")

class PackageLTIUseInline(admin.TabularInline):
    model = PackageLTIUse
    fields = ["lti_context","context_title"]
    readonly_fields = ["lti_context","context_title"]
    extra = 0
    def context_title(self,instance):
        return instance.lti_context

class ChirunPackageAdmin(admin.ModelAdmin):
    fieldsets = [(None,{"fields": ["name"]}),
                 ("UIDs",{"fields": ["uid","edit_uid"]}),
                 ("Status",{"fields":["last_compiled","last_launched"]}),
                 ("Git Connection",{"fields": ["git_url","git_username","git_status"],"classes": ["collapse"]})]
    list_display = ["name","uid","last_compiled","last_launched"]
    list_filter = [LastCompiledListFilter,LastLaunchedListFilter,GitExistsListFilter]
    list_display_links = ["name","uid"]
    readonly_fields = ["name","last_compiled","last_launched"]
    search_fields = ["uid","edit_uid","name"]
    inlines = [PackageLTIUseInline]

    def get_queryset(self,request):
        #add the sorting conditions for the last compiled and last launched functions.
        queryset = super().get_queryset(request) \
            .annotate(last_compiled_sort = Max("compilations__start_time")) \
            .annotate(last_launched_sort = Max("launches__launch_time"))
        return queryset
        


admin.site.register(ChirunPackage, ChirunPackageAdmin)
