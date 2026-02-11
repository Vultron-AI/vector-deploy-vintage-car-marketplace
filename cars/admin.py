from django.contrib import admin

from .models import Brand, Car, CarImage, Inquiry


class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 1
    fields = ["image_url", "alt_text", "is_primary", "sort_order"]


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at", "updated_at"]
    search_fields = ["name"]
    ordering = ["name"]


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ["__str__", "brand", "year", "price", "status", "is_featured", "created_at"]
    list_filter = ["status", "is_featured", "brand", "year"]
    search_fields = ["model", "brand__name", "description"]
    ordering = ["-created_at"]
    inlines = [CarImageInline]
    fieldsets = [
        (None, {"fields": ["brand", "model", "year", "price"]}),
        ("Details", {"fields": ["description", "status", "is_featured"]}),
    ]


@admin.register(CarImage)
class CarImageAdmin(admin.ModelAdmin):
    list_display = ["__str__", "car", "is_primary", "sort_order", "created_at"]
    list_filter = ["is_primary", "car__brand"]
    search_fields = ["car__model", "car__brand__name", "alt_text"]
    ordering = ["car", "sort_order"]


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ["collector_name", "collector_email", "car", "created_at"]
    list_filter = ["created_at", "car__brand"]
    search_fields = ["collector_name", "collector_email", "car__model", "car__brand__name", "message"]
    ordering = ["-created_at"]
    readonly_fields = ["created_at", "updated_at"]
    fieldsets = [
        ("Contact Information", {"fields": ["collector_name", "collector_email", "collector_phone"]}),
        ("Inquiry Details", {"fields": ["car", "message"]}),
        ("Timestamps", {"fields": ["created_at", "updated_at"]}),
    ]
