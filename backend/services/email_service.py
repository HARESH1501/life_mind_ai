"""
Email Service Layer
Handles all email sending operations with retry logic and error handling
"""

import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import List, Optional
from config import (
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
    SMTP_FROM_EMAIL, SMTP_FROM_NAME, SMTP_CONFIGURED, DEBUG
)

logger = logging.getLogger(__name__)


class EmailService:
    """Email service for sending notifications"""
    
    def __init__(self):
        self.smtp_host = SMTP_HOST
        self.smtp_port = SMTP_PORT
        self.smtp_user = SMTP_USER
        self.smtp_password = SMTP_PASSWORD
        self.from_email = SMTP_FROM_EMAIL
        self.from_name = SMTP_FROM_NAME
        self.configured = SMTP_CONFIGURED
        self.max_retries = 3
        self.retry_delay = 5  # seconds
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        retry_count: int = 0
    ) -> bool:
        """
        Send email with retry logic
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text email body (optional)
            retry_count: Current retry attempt
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        if not self.configured:
            logger.warning(f"Email not configured. Skipping email to {to_email}")
            return False
        
        if DEBUG:
            logger.info(f"[DEV MODE] Email would be sent to {to_email}: {subject}")
            return True
        
        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email
            msg["Date"] = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0000")
            
            # Attach text and HTML parts
            if text_content:
                msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}: {subject}")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP authentication failed: {str(e)}")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error: {str(e)}")
            if retry_count < self.max_retries:
                logger.info(f"Retrying email send (attempt {retry_count + 1}/{self.max_retries})")
                return self.send_email(to_email, subject, html_content, text_content, retry_count + 1)
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending email: {str(e)}")
            return False
    
    def send_login_alert(self, user_email: str, username: str, login_time: str) -> bool:
        """Send a security login notification to the user"""
        subject = "🔐 New Login to Your LifeMind AI Account"
        html_content = f"""
        <html>
            <body style="margin:0;padding:0;background:#0d1526;font-family:'Segoe UI',Arial,sans-serif;">
                <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                    <div style="background:linear-gradient(135deg,#1a2540 0%,#0f1a2e 100%);border-radius:20px;overflow:hidden;border:1px solid rgba(41,163,248,0.15);box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                        <!-- Header -->
                        <div style="background:linear-gradient(135deg,#1385ed,#7c3aed);padding:36px 40px;text-align:center;">
                            <div style="font-size:40px;margin-bottom:12px;">🧠</div>
                            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">LifeMind AI</h1>
                            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Security Alert — New Login Detected</p>
                        </div>
                        <!-- Body -->
                        <div style="padding:40px;">
                            <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;">Hi <strong style="color:#e2e8f0;">{username}</strong>,</p>
                            <p style="color:#94a3b8;font-size:15px;margin:0 0 24px;">We detected a new login to your LifeMind AI account. Here are the details:</p>
                            <div style="background:rgba(41,163,248,0.07);border:1px solid rgba(41,163,248,0.2);border-radius:12px;padding:24px;margin-bottom:28px;">
                                <table style="width:100%;border-collapse:collapse;">
                                    <tr>
                                        <td style="color:#64748b;font-size:13px;padding:8px 0;">🕐 Login Time</td>
                                        <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;">{login_time}</td>
                                    </tr>
                                    <tr>
                                        <td style="color:#64748b;font-size:13px;padding:8px 0;border-top:1px solid rgba(255,255,255,0.05);">📧 Account</td>
                                        <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;">{user_email}</td>
                                    </tr>
                                    <tr>
                                        <td style="color:#64748b;font-size:13px;padding:8px 0;border-top:1px solid rgba(255,255,255,0.05);">✅ Status</td>
                                        <td style="color:#10b981;font-size:13px;font-weight:600;text-align:right;">Successful</td>
                                    </tr>
                                </table>
                            </div>
                            <div style="background:rgba(244,63,94,0.07);border:1px solid rgba(244,63,94,0.2);border-radius:12px;padding:20px;margin-bottom:28px;">
                                <p style="color:#fb7185;font-size:13px;margin:0;"><strong>🚨 Not you?</strong> If you did not perform this login, please change your password immediately from your account settings.</p>
                            </div>
                            <p style="color:#475569;font-size:12px;text-align:center;margin:0;">This is an automated security alert from LifeMind AI. Do not reply to this email.</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """
        text_content = f"New Login Alert\n\nHi {username},\nA new login was detected on your account.\nTime: {login_time}\nAccount: {user_email}\n\nIf this wasn't you, change your password immediately."
        return self.send_email(user_email, subject, html_content, text_content)

    def send_habit_reminder(self, user_email: str, habit_name: str) -> bool:
        """Send habit reminder email"""
        subject = f"Habit Reminder: {habit_name}"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4CAF50;">Time for your habit!</h2>
                    <p>Hi there,</p>
                    <p>This is a friendly reminder to complete your habit:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #4CAF50;">{habit_name}</h3>
                    </div>
                    <p>Keep up the great work! Consistency is key to building lasting habits.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated message from LifeMind AI. 
                        You can manage your notification preferences in your settings.
                    </p>
                </div>
            </body>
        </html>
        """
        text_content = f"Habit Reminder: {habit_name}\n\nTime to complete your habit: {habit_name}\n\nKeep up the great work!"
        
        return self.send_email(user_email, subject, html_content, text_content)
    
    def send_task_reminder(self, user_email: str, task_title: str, due_date: str) -> bool:
        """Send task reminder email"""
        subject = f"Task Reminder: {task_title}"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2196F3;">Task Reminder</h2>
                    <p>Hi there,</p>
                    <p>You have an upcoming task:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2196F3;">{task_title}</h3>
                        <p style="margin: 5px 0;"><strong>Due:</strong> {due_date}</p>
                    </div>
                    <p>Make sure to complete this task on time!</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated message from LifeMind AI.
                    </p>
                </div>
            </body>
        </html>
        """
        text_content = f"Task Reminder: {task_title}\n\nDue: {due_date}\n\nMake sure to complete this task on time!"
        
        return self.send_email(user_email, subject, html_content, text_content)
    
    def send_meeting_reminder(
        self,
        user_email: str,
        meeting_title: str,
        start_time: str,
        location: Optional[str] = None
    ) -> bool:
        """Send meeting reminder email"""
        subject = f"Meeting Reminder: {meeting_title}"
        location_info = f"<p><strong>Location:</strong> {location}</p>" if location else ""
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #FF9800;">Meeting Reminder</h2>
                    <p>Hi there,</p>
                    <p>You have an upcoming meeting:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #FF9800;">{meeting_title}</h3>
                        <p style="margin: 5px 0;"><strong>Time:</strong> {start_time}</p>
                        {location_info}
                    </div>
                    <p>Please be on time for your meeting!</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated message from LifeMind AI.
                    </p>
                </div>
            </body>
        </html>
        """
        text_content = f"Meeting Reminder: {meeting_title}\n\nTime: {start_time}\n{f'Location: {location}' if location else ''}\n\nPlease be on time!"
        
        return self.send_email(user_email, subject, html_content, text_content)
    
    def send_daily_summary(
        self,
        user_email: str,
        habits_completed: int,
        tasks_completed: int,
        mood_entries: int,
        expenses_total: float
    ) -> bool:
        """Send daily productivity summary email"""
        subject = "Your Daily Productivity Summary"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #9C27B0;">Your Daily Summary</h2>
                    <p>Hi there,</p>
                    <p>Here's your productivity summary for today:</p>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #4CAF50;">
                                <h4 style="margin: 0 0 10px 0; color: #4CAF50;">Habits</h4>
                                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #4CAF50;">{habits_completed}</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">completed</p>
                            </div>
                            
                            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #2196F3;">
                                <h4 style="margin: 0 0 10px 0; color: #2196F3;">Tasks</h4>
                                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2196F3;">{tasks_completed}</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">completed</p>
                            </div>
                            
                            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #FF9800;">
                                <h4 style="margin: 0 0 10px 0; color: #FF9800;">Mood Entries</h4>
                                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #FF9800;">{mood_entries}</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">logged</p>
                            </div>
                            
                            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #F44336;">
                                <h4 style="margin: 0 0 10px 0; color: #F44336;">Expenses</h4>
                                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #F44336;">${expenses_total:.2f}</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">spent</p>
                            </div>
                        </div>
                    </div>
                    
                    <p>Great job staying productive! Keep up the momentum tomorrow.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated message from LifeMind AI.
                    </p>
                </div>
            </body>
        </html>
        """
        text_content = f"""Your Daily Summary

Habits Completed: {habits_completed}
Tasks Completed: {tasks_completed}
Mood Entries: {mood_entries}
Total Expenses: ${expenses_total:.2f}

Great job staying productive! Keep up the momentum tomorrow."""
        
        return self.send_email(user_email, subject, html_content, text_content)
    
    def send_welcome_email(self, user_email: str, username: str) -> bool:
        """Send welcome email to new user"""
        subject = "Welcome to LifeMind AI!"
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4CAF50;">Welcome to LifeMind AI!</h2>
                    <p>Hi {username},</p>
                    <p>Thank you for joining LifeMind AI, your personal AI-powered life assistant.</p>
                    
                    <h3 style="color: #333; margin-top: 30px;">Getting Started:</h3>
                    <ul style="line-height: 2;">
                        <li>📊 Track your habits and build consistency</li>
                        <li>✅ Manage your tasks and stay productive</li>
                        <li>💰 Monitor your expenses and budget</li>
                        <li>😊 Log your mood and track wellness</li>
                        <li>📅 Schedule meetings and get reminders</li>
                        <li>⚙️ Customize your preferences in settings</li>
                    </ul>
                    
                    <p style="margin-top: 30px;">We're excited to help you achieve your goals and live a more productive life!</p>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        This is an automated message from LifeMind AI.
                    </p>
                </div>
            </body>
        </html>
        """
        text_content = f"""Welcome to LifeMind AI!

Hi {username},

Thank you for joining LifeMind AI. We're excited to help you achieve your goals!

Getting Started:
- Track your habits and build consistency
- Manage your tasks and stay productive
- Monitor your expenses and budget
- Log your mood and track wellness
- Schedule meetings and get reminders
- Customize your preferences in settings

If you have any questions, feel free to reach out!"""
        
        return self.send_email(user_email, subject, html_content, text_content)


# Global email service instance
email_service = EmailService()
