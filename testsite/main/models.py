# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group_id = models.IntegerField()
    permission_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group_id', 'permission_id'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type_id = models.IntegerField()
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type_id', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.IntegerField()
    group_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user_id', 'group_id'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.IntegerField()
    permission_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user_id', 'permission_id'),)


class Dela(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    nazev = models.CharField(db_column='Nazev', max_length=100, blank=True, null=True)  # Field name made lowercase.
    delo1 = models.CharField(db_column='Delo1', max_length=100, blank=True, null=True)  # Field name made lowercase.
    delo2 = models.CharField(db_column='Delo2', max_length=100, blank=True, null=True)  # Field name made lowercase.
    naboj1 = models.CharField(db_column='Naboj1', max_length=5, blank=True, null=True)  # Field name made lowercase.
    naboj2 = models.CharField(db_column='Naboj2', max_length=5, blank=True, null=True)  # Field name made lowercase.
    naboj3 = models.CharField(db_column='Naboj3', max_length=5, blank=True, null=True)  # Field name made lowercase.
    penetrace1 = models.IntegerField(db_column='Penetrace1', blank=True, null=True)  # Field name made lowercase.
    penetrace2 = models.IntegerField(db_column='Penetrace2', blank=True, null=True)  # Field name made lowercase.
    penetrace3 = models.IntegerField(db_column='Penetrace3', blank=True, null=True)  # Field name made lowercase.
    poskozeni1 = models.IntegerField(db_column='Poskozeni1', blank=True, null=True)  # Field name made lowercase.
    poskozeni2 = models.IntegerField(db_column='Poskozeni2', blank=True, null=True)  # Field name made lowercase.
    poskozeni3 = models.IntegerField(db_column='Poskozeni3', blank=True, null=True)  # Field name made lowercase.
    nabijeni = models.FloatField(db_column='Nabijeni', blank=True, null=True)  # Field name made lowercase.
    zamereni = models.FloatField(db_column='Zamereni', blank=True, null=True)  # Field name made lowercase.
    presnost = models.FloatField(db_column='Presnost', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'dela'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type_id = models.IntegerField(blank=True, null=True)
    user_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Kategorie(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    nazev = models.CharField(db_column='Nazev', max_length=20, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'kategorie'


class Naboje(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    nazev = models.CharField(db_column='Nazev', max_length=5, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'naboje'


class Narod(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    nazev = models.CharField(db_column='Nazev', max_length=45, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'narod'


class Status(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    status = models.CharField(db_column='Status', max_length=10, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'status'

class Tank(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    nazev = models.CharField(db_column='Nazev', max_length=100, blank=True, null=True)  # Field name made lowercase.
    narod = models.ForeignKey(Narod, models.DO_NOTHING, db_column='Narod', blank=True, null=True)  # Field name made lowercase.
    tier = models.ForeignKey('Tier', models.DO_NOTHING, db_column='Tier', blank=True, null=True)  # Field name made lowercase.
    naboj1 = models.CharField(db_column='Naboj1', max_length=5, blank=True, null=True)  # Field name made lowercase.
    naboj2 = models.CharField(db_column='Naboj2', max_length=20, blank=True, null=True)  # Field name made lowercase.
    naboj3 = models.CharField(db_column='Naboj3', max_length=5, blank=True, null=True)  # Field name made lowercase.
    kategorie = models.ForeignKey(Kategorie, models.DO_NOTHING, db_column='Kategorie', blank=True, null=True)  # Field name made lowercase.
    status = models.CharField(db_column="Status", max_length=10, blank=True, null=True)  # Field name made lowercase.
    prubojnost1 = models.IntegerField(db_column='Prubojnost1', blank=True, null=True)  # Field name made lowercase.
    prubojnost2 = models.IntegerField(db_column='Prubojnost2', blank=True, null=True)  # Field name made lowercase.
    prubojnost3 = models.IntegerField(db_column='Prubojnost3', blank=True, null=True)  # Field name made lowercase.
    poskozeni1 = models.IntegerField(db_column='Poskozeni1', blank=True, null=True)  # Field name made lowercase.
    poskozeni2 = models.IntegerField(db_column='Poskozeni2', blank=True, null=True)  # Field name made lowercase.
    poskozeni3 = models.IntegerField(db_column='Poskozeni3', blank=True, null=True)  # Field name made lowercase.
    presnost = models.FloatField(db_column='Presnost', blank=True, null=True)  # Field name made lowercase.
    pocetran = models.IntegerField(db_column='PocetRan', blank=True, null=True)  # Field name made lowercase.
    mezinabijeni = models.FloatField(db_column='MeziNabijeni', blank=True, null=True)  # Field name made lowercase.
    nabijeni = models.FloatField(db_column='Nabijeni', blank=True, null=True)  # Field name made lowercase.
    nabijeni2 = models.FloatField(db_column='Nabijeni2', blank=True, null=True)  # Field name made lowercase.
    nabijeni3 = models.FloatField(db_column='Nabijeni3', blank=True, null=True)  # Field name made lowercase.
    nabijeni4 = models.FloatField(db_column='Nabijeni4', blank=True, null=True)  # Field name made lowercase.
    zamereni = models.FloatField(db_column='Zamereni', blank=True, null=True)  # Field name made lowercase.
    rychlost = models.FloatField(db_column='Rychlost', blank=True, null=True)  # Field name made lowercase.
    couvani = models.FloatField(db_column='Couvani', blank=True, null=True)  # Field name made lowercase.
    vykon = models.IntegerField(db_column='Vykon', blank=True, null=True)  # Field name made lowercase.
    konetuna = models.FloatField(db_column='KoneTuna', blank=True, null=True)  # Field name made lowercase.
    otacenikorba = models.FloatField(db_column='OtaceniKorba', blank=True, null=True)  # Field name made lowercase.
    otacenivez = models.CharField(db_column='OtaceniVez', max_length=20, blank=True, null=True)  # Field name made lowercase.
    elevace = models.FloatField(db_column='Elevace', blank=True, null=True)  # Field name made lowercase.
    deprese = models.FloatField(db_column='Deprese', blank=True, null=True)  # Field name made lowercase.
    korbapred = models.FloatField(db_column='Korbapred', blank=True, null=True)  # Field name made lowercase.
    korbabok = models.FloatField(db_column='Korbabok', blank=True, null=True)  # Field name made lowercase.
    korbazad = models.FloatField(db_column='Korbazad', blank=True, null=True)  # Field name made lowercase.
    vezpred = models.FloatField(db_column='Vezpred', blank=True, null=True)  # Field name made lowercase.
    vezbok = models.FloatField(db_column='Vezbok', blank=True, null=True)  # Field name made lowercase.
    vezzad = models.FloatField(db_column='Vezzad', blank=True, null=True)  # Field name made lowercase.
    zivoty = models.IntegerField(db_column='Zivoty', blank=True, null=True)  # Field name made lowercase.
    naklad = models.FloatField(db_column='Naklad', blank=True, null=True)  # Field name made lowercase.
    hmotnost = models.FloatField(db_column='Hmotnost', blank=True, null=True)  # Field name made lowercase.
    dohled = models.IntegerField(db_column='Dohled', blank=True, null=True)  # Field name made lowercase.
    cena = models.CharField(db_column='Cena', max_length=45, blank=True, null=True)  # Field name made lowercase.
    vyzkum = models.IntegerField(db_column='Vyzkum', blank=True, null=True)  # Field name made lowercase.
    odkaz = models.CharField(db_column='Odkaz', max_length=100, blank=True, null=True)  # Field name made lowercase.
    product_status = models.CharField(max_length=1)
    vicedel = models.CharField(db_column='ViceDel', max_length=1, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'tank'
        unique_together = (('korbapred', 'korbabok', 'korbazad', 'vezpred', 'vezbok', 'vezzad', 'nazev'),)


class Tier(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    cislo = models.CharField(db_column='Cislo', max_length=5, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'tier'