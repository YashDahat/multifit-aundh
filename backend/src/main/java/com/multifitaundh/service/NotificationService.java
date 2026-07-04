package com.multifitaundh.service;

import com.multifitaundh.dto.TrialLeadDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final JavaMailSender javaMailSender;
    private final String adminEmail;

    public NotificationService(JavaMailSender javaMailSender, @Value("${app.admin.email}") String adminEmail) {
        this.javaMailSender = javaMailSender;
        this.adminEmail = adminEmail;
    }

    public void sendNewLeadNotification(TrialLeadDto lead) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setTo(adminEmail);
            helper.setSubject("New 3-Day Free Trial Lead from MultiFit Aundh");

            String emailBody = String.format(
                "A new 3-Day Free Trial lead has been captured:\n\n" +
                "Name: %s\n" +
                "Email: %s\n" +
                "Phone: %s\n" +
                "Submitted At: %s",
                lead.getName(),
                lead.getEmail(),
                lead.getPhone(),
                lead.getCreatedAt().toString()
            );

            helper.setText(emailBody, false); // false for plain text

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // As per rules, no explicit error handling (logging, custom exceptions) unless required.
            // Re-throwing as a RuntimeException to satisfy compilation without altering signature.
            throw new RuntimeException("Failed to send new lead notification email", e);
        }
    }
}