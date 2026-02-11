from __future__ import annotations

from django.db import models

from shared.models import BaseModel


class Brand(BaseModel):
    """
    Car brand/make (e.g., Ferrari, Porsche, Mercedes-Benz).
    """

    name = models.CharField(max_length=100, unique=True)
    logo_url = models.URLField(blank=True, default="")
    description = models.TextField(blank=True, default="")

    class Meta:
        db_table = "brands"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Car(BaseModel):
    """
    Vintage car listing with details.
    """

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        ACTIVE = "active", "Active"
        SOLD = "sold", "Sold"
        ARCHIVED = "archived", "Archived"

    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        related_name="cars",
    )
    model = models.CharField(max_length=200)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, default="")
    is_featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    class Meta:
        db_table = "cars"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.year} {self.brand.name} {self.model}"


class CarImage(BaseModel):
    """
    Images for a car listing. Supports multiple photos per car.
    """

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image_url = models.URLField()
    alt_text = models.CharField(max_length=255, blank=True, default="")
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "car_images"
        ordering = ["sort_order", "created_at"]

    def __str__(self) -> str:
        return f"Image for {self.car}"


class Inquiry(BaseModel):
    """
    Contact form submission for a car listing.
    """

    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="inquiries",
    )
    collector_name = models.CharField(max_length=200)
    collector_email = models.EmailField()
    collector_phone = models.CharField(max_length=50, blank=True, default="")
    message = models.TextField()

    class Meta:
        db_table = "inquiries"
        ordering = ["-created_at"]
        verbose_name_plural = "Inquiries"

    def __str__(self) -> str:
        return f"Inquiry from {self.collector_name} for {self.car}"
