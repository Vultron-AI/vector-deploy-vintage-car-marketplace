"""Factories for creating test data for cars app."""
from __future__ import annotations

from decimal import Decimal
from typing import Any

from cars.models import Brand, Car, CarImage, Inquiry


def create_brand(
    name: str = "Ferrari",
    logo_url: str = "https://example.com/ferrari-logo.png",
    description: str = "Italian luxury sports car manufacturer",
    **kwargs: Any,
) -> Brand:
    """Create a test brand with sensible defaults."""
    return Brand.objects.create(
        name=name,
        logo_url=logo_url,
        description=description,
        **kwargs,
    )


def create_car(
    brand: Brand | None = None,
    model: str = "250 GTO",
    year: int = 1962,
    price: Decimal | str = "25000000.00",
    description: str = "A legendary vintage sports car",
    is_featured: bool = False,
    status: str = Car.Status.ACTIVE,
    **kwargs: Any,
) -> Car:
    """Create a test car with sensible defaults."""
    if brand is None:
        brand = create_brand()
    if isinstance(price, str):
        price = Decimal(price)
    return Car.objects.create(
        brand=brand,
        model=model,
        year=year,
        price=price,
        description=description,
        is_featured=is_featured,
        status=status,
        **kwargs,
    )


def create_car_image(
    car: Car | None = None,
    image_url: str = "https://example.com/car-image.jpg",
    alt_text: str = "Car image",
    is_primary: bool = False,
    sort_order: int = 0,
    **kwargs: Any,
) -> CarImage:
    """Create a test car image with sensible defaults."""
    if car is None:
        car = create_car()
    return CarImage.objects.create(
        car=car,
        image_url=image_url,
        alt_text=alt_text,
        is_primary=is_primary,
        sort_order=sort_order,
        **kwargs,
    )


def create_inquiry(
    car: Car | None = None,
    collector_name: str = "John Doe",
    collector_email: str = "john@example.com",
    collector_phone: str = "+1-555-123-4567",
    message: str = "I am very interested in this beautiful car. Please contact me at your earliest convenience.",
    **kwargs: Any,
) -> Inquiry:
    """Create a test inquiry with sensible defaults."""
    if car is None:
        car = create_car()
    return Inquiry.objects.create(
        car=car,
        collector_name=collector_name,
        collector_email=collector_email,
        collector_phone=collector_phone,
        message=message,
        **kwargs,
    )
