""" This module contains the ProductForm class for creating and
 updating products. """
from django import forms
from .widgets import CustomClearableFileInput
from .models import Product, Category


class ProductForm(forms.ModelForm):
    """" This class will create a form for the Product model and
    all of its fields."""

    class Meta:
        """ This class edits the default meta class to include the
        Product model and all of its fields """
        model = Product
        fields = '__all__'

    image = forms.ImageField(label='Image', required=False,
                             widget=CustomClearableFileInput)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        categories = Category.objects.all()  # pylint: disable=no-member
        friendly_names = [(c.id, c.get_friendly_name()) for c in categories]

        self.fields['category'].choices = friendly_names
        for field_name, field in self.fields.items():  # pylint: disable=unused-variable
            field.widget.attrs['class'] = 'border-black rounded-0'
