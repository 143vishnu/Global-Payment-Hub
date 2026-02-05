package com.GPS.Global.Payment.Strategy.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        System.out.println("admin: " + encoder.encode("admin"));
        System.out.println("password: " + encoder.encode("password"));
    }
}
