# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-05-04 09:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0032_auto_20160504_0932'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='image_source',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
