# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-20 13:44
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('graphs', '0004_student_current_activity'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='start_date',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 3, 20, 13, 44, 23, 948965, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
