# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-05 14:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0012_auto_20160405_1044'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='type',
            field=models.CharField(choices=[('text', 'Text'), ('quiz', 'Quiz'), ('link', 'Link'), ('psycho', 'Psycho')], max_length=8),
        ),
    ]
