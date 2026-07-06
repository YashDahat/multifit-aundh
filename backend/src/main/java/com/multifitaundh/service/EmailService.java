package com.multifitaundh.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import com.multifitaundh.model.Booking;
import com.multifitaundh.model.Membership;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    private static final String BUSINESS_NAME = "MultiFit Aundh";
    private static final String FROM_ADDRESS = "noreply@multifitaundh.com";

    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendWelcomeEmail(String toEmail, String userName) throws MessagingException, MailException {
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("businessName", BUSINESS_NAME);

        String htmlContent = templateEngine.process("emails/welcome-email.html", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM_ADDRESS);
        helper.setTo(toEmail);
        helper.setSubject("Welcome to MultiFit Aundh, " + userName + "!");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendBookingConfirmationEmail(String toEmail, String userName, String className, String classDate, String classTime) throws MessagingException, MailException {
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("className", className);
        context.setVariable("classDate", classDate);
        context.setVariable("classTime", classTime);
        context.setVariable("businessName", BUSINESS_NAME);

        String htmlContent = templateEngine.process("emails/booking-confirmation-email.html", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM_ADDRESS);
        helper.setTo(toEmail);
        helper.setSubject("Your MultiFit Aundh Class Booking is Confirmed!");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendBookingCancellationEmail(String toEmail, String userName, String className, String classDate, String classTime) throws MessagingException, MailException {
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("className", className);
        context.setVariable("classDate", classDate);
        context.setVariable("classTime", classTime);
        context.setVariable("businessName", BUSINESS_NAME);

        String htmlContent = templateEngine.process("emails/booking-cancellation-email.html", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM_ADDRESS);
        helper.setTo(toEmail);
        helper.setSubject("MultiFit Aundh: Your Class Booking Has Been Cancelled");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendMembershipConfirmationEmail(String toEmail, String userName, String membershipPlan, String startDate, String endDate) throws MessagingException, MailException {
        Context context = new Context();
        context.setVariable("userName", userName);
        context.setVariable("membershipPlan", membershipPlan);
        context.setVariable("startDate", startDate);
        context.setVariable("endDate", endDate);
        context.setVariable("businessName", BUSINESS_NAME);

        String htmlContent = templateEngine.process("emails/membership-confirmation-email.html", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(FROM_ADDRESS);
        helper.setTo(toEmail);
        helper.setSubject("Welcome to Your New MultiFit Aundh Membership, " + userName + "!");
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}