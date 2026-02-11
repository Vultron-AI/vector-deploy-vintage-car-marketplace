from __future__ import annotations

from rest_framework import serializers

from .models import Brand, Car, CarImage, Inquiry


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model."""

    class Meta:
        model = Brand
        fields = [
            "id",
            "name",
            "logo_url",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CarImageSerializer(serializers.ModelSerializer):
    """Serializer for CarImage model."""

    class Meta:
        model = CarImage
        fields = [
            "id",
            "image_url",
            "alt_text",
            "is_primary",
            "sort_order",
        ]
        read_only_fields = ["id"]


class CarListSerializer(serializers.ModelSerializer):
    """Serializer for Car list view (minimal data)."""

    brand = BrandSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Car
        fields = [
            "id",
            "brand",
            "model",
            "year",
            "price",
            "is_featured",
            "status",
            "primary_image",
            "created_at",
        ]
        read_only_fields = fields

    def get_primary_image(self, obj: Car) -> str | None:
        """Get the primary image URL for the car."""
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return primary.image_url
        # Fallback to first image if no primary is set
        first_image = obj.images.first()
        return first_image.image_url if first_image else None


class CarDetailSerializer(serializers.ModelSerializer):
    """Serializer for Car detail view (full data)."""

    brand = BrandSerializer(read_only=True)
    images = CarImageSerializer(many=True, read_only=True)

    class Meta:
        model = Car
        fields = [
            "id",
            "brand",
            "model",
            "year",
            "price",
            "description",
            "is_featured",
            "status",
            "images",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class InquiryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating inquiries (contact form submissions)."""

    class Meta:
        model = Inquiry
        fields = [
            "id",
            "car",
            "collector_name",
            "collector_email",
            "collector_phone",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_collector_email(self, value: str) -> str:
        """Ensure email is lowercase."""
        return value.lower().strip()

    def validate_message(self, value: str) -> str:
        """Ensure message is not empty and is reasonable length."""
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError(
                "Message must be at least 10 characters long."
            )
        if len(value) > 5000:
            raise serializers.ValidationError(
                "Message must be less than 5000 characters."
            )
        return value
