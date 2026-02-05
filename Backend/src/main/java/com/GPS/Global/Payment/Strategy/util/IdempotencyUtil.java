package com.GPS.Global.Payment.Strategy.util;

import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Utility class for idempotency key operations
 */
@Slf4j
public class IdempotencyUtil {

    private IdempotencyUtil() {
        // Private constructor to prevent instantiation
    }

    /**
     * Generate idempotency key from request data
     * 
     * @param data Request data
     * @return Idempotency key
     */
    public static String generateKey(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("Error generating idempotency key", e);
            throw new RuntimeException("Failed to generate idempotency key", e);
        }
    }

    /**
     * Validate idempotency key format
     * 
     * @param key Idempotency key
     * @return true if valid
     */
    public static boolean isValidKey(String key) {
        return key != null && !key.isEmpty() && key.length() <= 100;
    }
}
