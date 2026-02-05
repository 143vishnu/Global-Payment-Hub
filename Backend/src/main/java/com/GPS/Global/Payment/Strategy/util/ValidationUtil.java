package com.GPS.Global.Payment.Strategy.util;

import java.math.BigDecimal;
import java.util.regex.Pattern;

/**
 * Utility class for validation operations
 */
public class ValidationUtil {

    private static final Pattern IBAN_PATTERN = Pattern.compile("[A-Z]{2}[0-9]{2}[A-Z0-9]+");
    private static final Pattern CURRENCY_PATTERN = Pattern.compile("[A-Z]{3}");
    private static final Pattern ALPHA_NUMERIC_PATTERN = Pattern.compile("^[a-zA-Z0-9]+$");

    private ValidationUtil() {
        // Private constructor to prevent instantiation
    }

    /**
     * Validate IBAN format
     * 
     * @param iban IBAN to validate
     * @return true if valid
     */
    public static boolean isValidIBAN(String iban) {
        if (iban == null || iban.isEmpty()) {
            return false;
        }
        return IBAN_PATTERN.matcher(iban).matches();
    }

    /**
     * Validate currency code (ISO 4217)
     * 
     * @param currency Currency code to validate
     * @return true if valid
     */
    public static boolean isValidCurrency(String currency) {
        if (currency == null || currency.isEmpty()) {
            return false;
        }
        return CURRENCY_PATTERN.matcher(currency).matches();
    }

    /**
     * Validate amount is positive
     * 
     * @param amount Amount to validate
     * @return true if positive
     */
    public static boolean isPositiveAmount(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Validate alphanumeric string
     * 
     * @param value String to validate
     * @return true if alphanumeric
     */
    public static boolean isAlphaNumeric(String value) {
        if (value == null || value.isEmpty()) {
            return false;
        }
        return ALPHA_NUMERIC_PATTERN.matcher(value).matches();
    }
}
