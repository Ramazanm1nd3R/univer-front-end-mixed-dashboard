from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с фронтенда

# Email конфигурация
EMAIL_SENDER = os.getenv('EMAIL_SENDER', '')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', '')


def send_email_results(user_email, code, verification_type):
    """
    Отправка кода верификации на email ПОЛЬЗОВАТЕЛЯ
    """
    try:
        timestamp = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        
        type_text = "регистрации" if verification_type == "register" else "входа"
        type_emoji = "👤" if verification_type == "register" else "🔐"
        
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                }}
                .header {{ 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 20px; 
                    border-radius: 10px; 
                }}
                .code-box {{ 
                    background: #f8f9fa; 
                    padding: 30px; 
                    margin: 20px 0; 
                    border-left: 5px solid #667eea; 
                    border-radius: 5px;
                    text-align: center;
                }}
                .code {{ 
                    font-size: 48px; 
                    font-weight: 900; 
                    color: #667eea; 
                    letter-spacing: 10px;
                    font-family: 'Courier New', monospace;
                }}
                .warning {{ 
                    background: #fff4e6; 
                    padding: 15px; 
                    border-left: 5px solid #f59e0b; 
                    border-radius: 5px; 
                    margin-top: 20px; 
                }}
                h2 {{ 
                    color: #667eea; 
                }}
                .timestamp {{ 
                    color: #666; 
                    font-size: 0.9em; 
                }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>{type_emoji} Mixed Dashboard - Код верификации</h1>
                <p class="timestamp">Дата: {timestamp}</p>
            </div>
            
            <h2>Здравствуйте!</h2>
            <p>Вы запросили код для {type_text} в системе <strong>Mixed Dashboard</strong>.</p>
            
            <div class="code-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Ваш код верификации:</p>
                <div class="code">{code}</div>
            </div>
            
            <p><strong>⏱️ Важно:</strong> Код действителен в течение <strong>60 секунд</strong> с момента отправки.</p>
            
            <div class="warning">
                <p><strong>🔒 Безопасность:</strong></p>
                <p>Никогда не сообщайте этот код третьим лицам. Сотрудники Mixed Dashboard никогда не попросят вас предоставить код верификации.</p>
            </div>
            
            <hr style="margin-top: 30px;">
            <p style="color: #666; font-size: 0.9em;">
                Автоматический email системы "Mixed Dashboard"<br>
                Если вы не запрашивали этот код, просто проигнорируйте это письмо.
            </p>
        </body>
        </html>
        """
        
        # Создаем сообщение
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"{type_emoji} Код верификации Mixed Dashboard - {code}"
        msg['From'] = EMAIL_SENDER
        msg['To'] = user_email  # ← Отправляем на email пользователя!
        
        # Прикрепляем HTML
        html_part = MIMEText(html_body, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Отправляем через Gmail SMTP
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, user_email, msg.as_string())  # ← На email пользователя!
        server.quit()
        
        print(f"✅ Email отправлен на {user_email}")
        print(f"🔐 Код: {code}")
        print(f"📧 От: {EMAIL_SENDER}")
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка отправки email: {e}")
        return False


@app.route('/api/send-verification-code', methods=['POST'])
def send_verification_code():
    """
    Эндпоинт для отправки кода верификации
    """
    try:
        data = request.json
        user_email = data.get('email')
        code = data.get('code')
        verification_type = data.get('type', 'login')
        
        if not user_email or not code:
            return jsonify({
                'success': False,
                'error': 'Email и код обязательны'
            }), 400
        
        # Отправляем email на адрес пользователя
        success = send_email_results(user_email, code, verification_type)
        
        if success:
            return jsonify({
                'success': True,
                'message': f'Код отправлен на {user_email}',  # ← Показываем email пользователя
                'code': code  # В development режиме возвращаем код для тестирования
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Не удалось отправить email'
            }), 500
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Проверка работы сервера
    """
    return jsonify({
        'status': 'OK',
        'message': 'Flask backend работает',
        'email_sender': EMAIL_SENDER
    }), 200


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print("🚀 Flask Backend запускается...")
    print(f"📧 Email отправитель: {EMAIL_SENDER}")
    print(f"🔗 Порт: {port}")
    print(f"🐛 Debug: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)