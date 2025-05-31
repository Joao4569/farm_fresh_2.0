"""Custom storage classes for handling static and media files on AWS S3."""
from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorage(S3Boto3Storage):  # pylint: disable=abstract-method
    """Storage class for static files on AWS S3."""
    location = 'static'
    default_acl = 'public-read'


class MediaStorage(S3Boto3Storage):  # pylint: disable=abstract-method
    """Storage class for media files on AWS S3."""
    location = 'media'
    file_overwrite = False
    default_acl = 'public-read'
