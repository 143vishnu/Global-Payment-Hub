import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useBatch } from '../../context/BatchContext';

const BulkUpload = ({ onUploadSuccess }) => {
  const { uploadBatch, loading } = useBatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        setError('Invalid file type. Please upload a CSV or Excel file.');
        setSelectedFile(null);
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError('');
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setError('');
    const result = await uploadBatch(selectedFile);

    if (result.success) {
      setUploadStatus({
        success: true,
        message: 'File uploaded successfully!',
        jobId: result.data.jobId,
      });
      setSelectedFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }
    } else {
      setUploadStatus({
        success: false,
        message: result.error,
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus(null);
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Batch File
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Upload a CSV or Excel file containing payment records. Maximum file size: 10MB
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {uploadStatus && (
          <Alert 
            severity={uploadStatus.success ? 'success' : 'error'} 
            sx={{ mb: 2 }}
            icon={uploadStatus.success ? <SuccessIcon /> : <ErrorIcon />}
          >
            {uploadStatus.message}
            {uploadStatus.jobId && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Job ID: {uploadStatus.jobId}
              </Typography>
            )}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <input
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            id="bulk-upload-file"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="bulk-upload-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              fullWidth
            >
              Select File
            </Button>
          </label>
        </Box>

        {selectedFile && (
          <Box sx={{ mb: 2 }}>
            <List dense>
              <ListItem>
                <ListItemText
                  primary={selectedFile.name}
                  secondary={`Size: ${(selectedFile.size / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            </List>
          </Box>
        )}

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            fullWidth
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BulkUpload;
