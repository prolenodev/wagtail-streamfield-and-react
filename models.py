# This is for the post shared on my blog: stackingtabs.medium.com
# My aim is to display the body streamfield filled with paragraphs, images, etc.  in React.
# This means the data (the paragraphs, images in body streamfield) has to be exposed over Wagtail v2 API and then consumed by React.

from django.db import models

from wagtail import blocks
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock
from wagtail.api import APIField

class Blog(Page):

    body = StreamField([
        ('gallery', blocks.ListBlock(ImageChooserBlock())),
        ('heading', blocks.CharBlock(form_classname="title")),
        ('paragraph', blocks.RichTextBlock()),
        ('image', ImageChooserBlock()),
        ('video', EmbedBlock()),
    ], use_json_field=True)

    content_panels = Page.content_panels + [
        FieldPanel('body')
    ]

    api_fields = [
        APIField('body')
    ]

