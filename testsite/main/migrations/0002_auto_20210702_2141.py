# Generated by Django 3.2.5 on 2021-07-02 19:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tank',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Nazev', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'tank',
            },
        ),
        migrations.DeleteModel(
            name='Student',
        ),
    ]