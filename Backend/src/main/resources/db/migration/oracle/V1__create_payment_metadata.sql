-- DDL Script for PaymentMetadata table
-- Oracle Database Schema
-- Run this script in production Oracle database

-- Create sequence for primary key generation
CREATE SEQUENCE PAYMENT_METADATA_SEQ
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- Create PaymentMetadata table
CREATE TABLE PAYMENT_METADATA (
    id NUMBER(19) NOT NULL,
    payment_id VARCHAR2(50) NOT NULL,
    status VARCHAR2(50) NOT NULL,
    channel VARCHAR2(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    correlation_id VARCHAR2(100),
    metadata_json VARCHAR2(4000),
    version NUMBER(19) DEFAULT 0,
    CONSTRAINT pk_payment_metadata PRIMARY KEY (id),
    CONSTRAINT uk_payment_id UNIQUE (payment_id)
);

-- Create indexes for performance
CREATE INDEX idx_payment_id ON PAYMENT_METADATA(payment_id);
CREATE INDEX idx_status ON PAYMENT_METADATA(status);
CREATE INDEX idx_channel ON PAYMENT_METADATA(channel);
CREATE INDEX idx_created_at ON PAYMENT_METADATA(created_at);

-- Add comments
COMMENT ON TABLE PAYMENT_METADATA IS 'Stores payment transaction metadata for tracking and auditing';
COMMENT ON COLUMN PAYMENT_METADATA.id IS 'Primary key - auto-generated from sequence';
COMMENT ON COLUMN PAYMENT_METADATA.payment_id IS 'Business key - unique payment identifier';
COMMENT ON COLUMN PAYMENT_METADATA.status IS 'Payment status (PENDING, PROCESSING, COMPLETED, FAILED, REJECTED)';
COMMENT ON COLUMN PAYMENT_METADATA.channel IS 'Source channel identifier (WEB, MOBILE, API, IBM_MQ, KAFKA)';
COMMENT ON COLUMN PAYMENT_METADATA.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN PAYMENT_METADATA.updated_at IS 'Timestamp when record was last updated';
COMMENT ON COLUMN PAYMENT_METADATA.correlation_id IS 'Correlation ID for distributed tracing';
COMMENT ON COLUMN PAYMENT_METADATA.metadata_json IS 'Additional metadata as JSON';
COMMENT ON COLUMN PAYMENT_METADATA.version IS 'Optimistic locking version';
