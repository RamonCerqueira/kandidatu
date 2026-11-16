from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, CandidateProfile, Company

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role']
        read_only_fields = ['id', 'role']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email').strip().lower()
        password = attrs.get('password')

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Credenciais inválidas. Verifique o e-mail e a palavra-passe.'})

        if not user.check_password(password):
            raise serializers.ValidationError({'detail': 'Credenciais inválidas. Verifique o e-mail e a palavra-passe.'})

        if not user.is_active:
            raise serializers.ValidationError({'detail': 'Esta conta encontra-se desativada.'})

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        # Custom claims for JWT if desired
        refresh['email'] = user.email
        refresh['role'] = user.role
        refresh['name'] = user.name

        return {
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }


class CandidateRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    fullName = serializers.CharField(max_length=160)
    phone = serializers.CharField(max_length=24)
    whatsapp = serializers.CharField(max_length=24, required=False, allow_blank=True)
    region = serializers.CharField(max_length=30)
    citySector = serializers.CharField(max_length=100)
    educationLevel = serializers.CharField(max_length=80, required=False, allow_blank=True)
    primaryCategory = serializers.CharField(max_length=120, required=False, allow_blank=True)
    experienceLevel = serializers.CharField(max_length=80, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError('Este e-mail já se encontra registado.')
        return value.strip().lower()

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        full_name = validated_data.pop('fullName')
        phone = validated_data.pop('phone')
        whatsapp = validated_data.pop('whatsapp', '')
        region = validated_data.pop('region')
        city_sector = validated_data.pop('citySector')

        user = User.objects.create_user(
            email=email,
            password=password,
            name=full_name,
            role=User.Role.CANDIDATE
        )

        CandidateProfile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            whatsapp=whatsapp,
            city=f"{region} - {city_sector}",
            summary=f"Área: {validated_data.get('primaryCategory', '')} | Nível: {validated_data.get('experienceLevel', '')}"
        )

        return user


class CompanyRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    organizationType = serializers.CharField(max_length=40)
    legalName = serializers.CharField(max_length=200)
    tradeName = serializers.CharField(max_length=200, required=False, allow_blank=True)
    taxId = serializers.CharField(max_length=60)
    sector = serializers.CharField(max_length=120)
    sizeRange = serializers.CharField(max_length=20)
    region = serializers.CharField(max_length=30)
    citySector = serializers.CharField(max_length=100)
    addressReference = serializers.CharField(required=False, allow_blank=True)
    website = serializers.CharField(required=False, allow_blank=True)
    contactName = serializers.CharField(max_length=160)
    contactRole = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=24)
    whatsapp = serializers.CharField(max_length=24, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError('Este e-mail já se encontra registado.')
        return value.strip().lower()

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        legal_name = validated_data.pop('legalName')
        trade_name = validated_data.pop('tradeName', '') or legal_name

        user = User.objects.create_user(
            email=email,
            password=password,
            name=trade_name,
            role=User.Role.COMPANY
        )

        Company.objects.create(
            owner_user=user,
            organization_type=validated_data.get('organizationType', 'EMPRESA_PRIVADA'),
            legal_name=legal_name,
            trade_name=trade_name,
            tax_id=validated_data.get('taxId'),
            sector=validated_data.get('sector'),
            size_range=validated_data.get('sizeRange'),
            region=validated_data.get('region', 'BISSAU'),
            city=validated_data.get('citySector', ''),
            address=validated_data.get('addressReference', ''),
            website=validated_data.get('website', ''),
            contact_name=validated_data.get('contactName'),
            contact_role=validated_data.get('contactRole'),
            phone=validated_data.get('phone'),
            whatsapp=validated_data.get('whatsapp', ''),
            email=email,
            moderation_status=Company.ModerationStatus.PENDING,
            verified=False
        )

        return user

