from django import template

register = template.Library()

@register.filter
def get_index(arr, index):
    return arr[index]
