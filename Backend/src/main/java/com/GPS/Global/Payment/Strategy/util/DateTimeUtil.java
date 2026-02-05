package com.GPS.Global.Payment.Strategy.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Utility class for date/time operations
 */
public class DateTimeUtil {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    private static final ZoneId UTC = ZoneId.of("UTC");

    private DateTimeUtil() {
        // Private constructor to prevent instantiation
    }

    /**
     * Get current UTC timestamp
     * 
     * @return Current UTC timestamp
     */
    public static LocalDateTime getCurrentUTC() {
        return ZonedDateTime.now(UTC).toLocalDateTime();
    }

    /**
     * Convert LocalDateTime to ISO 8601 string
     * 
     * @param dateTime LocalDateTime to convert
     * @return ISO formatted string
     */
    public static String toISOString(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.atZone(UTC).format(ISO_FORMATTER);
    }

    /**
     * Parse ISO 8601 string to LocalDateTime
     * 
     * @param isoString ISO formatted string
     * @return LocalDateTime
     */
    public static LocalDateTime fromISOString(String isoString) {
        if (isoString == null || isoString.isEmpty()) {
            return null;
        }
        return ZonedDateTime.parse(isoString, ISO_FORMATTER).toLocalDateTime();
    }
}
