# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-22 12:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0009_result'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='activity',
        ),
        migrations.AddField(
            model_name='question',
            name='activity',
            field=models.ManyToManyField(to='graphs.Activity'),
        ),
    ]
