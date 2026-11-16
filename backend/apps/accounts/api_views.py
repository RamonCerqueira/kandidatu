from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    LoginSerializer,
    UserSerializer,
    CandidateRegisterSerializer,
    CompanyRegisterSerializer
)

class ApiLoginView(APIView):
    """
    POST /api/auth/login
    Recebe {email, password} e retorna {token, user: {id, email, name, role}}
    Alinhado com o contrato da aplicação frontend React.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiMeView(APIView):
    """
    GET /api/auth/me
    Retorna os dados do utilizador atualmente autenticado via JWT Bearer Token.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApiRegisterCandidateView(APIView):
    """
    POST /api/auth/register/candidate
    Registo completo de novo candidato com perfil profissional da Guiné-Bissau.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CandidateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Candidato registado com sucesso.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiRegisterCompanyView(APIView):
    """
    POST /api/auth/register/company
    Registo de entidade empregadora (empresa, ONG, organismo, instituição pública).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CompanyRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Organização registada com sucesso (pendente de moderação).',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApiForgotPasswordView(APIView):
    """
    POST /api/auth/forgot-password
    Resposta neutra para garantir segurança (não revela existência de e-mail).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # Resposta neutra de segurança conforme docs/API.md
        return Response({
            'detail': 'Se o endereço estiver associado a uma conta ativa, receberá uma mensagem com instruções de recuperação.'
        }, status=status.HTTP_200_OK)

