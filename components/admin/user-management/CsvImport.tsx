'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { userService } from '@/lib/services/userService';
import { Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CsvImportProps {
  onImportComplete: () => void;
}

export function CsvImport({ onImportComplete }: CsvImportProps) {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        setResults({ success: 0, failed: 0, errors: ['CSV file is empty'] });
        setImporting(false);
        return;
      }

      // Parse header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['firstname', 'lastname', 'username', 'email', 'password'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        setResults({
          success: 0,
          failed: 0,
          errors: [`Missing required columns: ${missingHeaders.join(', ')}`]
        });
        setImporting(false);
        return;
      }

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      // Process data rows
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === 0 || values.every(v => !v)) continue;

        try {
          const userData: any = {};
          headers.forEach((header, index) => {
            userData[header] = values[index];
          });

          userService.createUser({
            username: userData.username,
            firstName: userData.firstname,
            lastName: userData.lastname,
            email: userData.email,
            password: userData.password,
            role: (userData.role?.toLowerCase() === 'admin' ? 'admin' : 'user') as any,
            status: (userData.status?.toLowerCase() || 'active') as any,
            department: userData.department || undefined,
            phone: userData.phone || undefined
          });

          successCount++;
        } catch (error) {
          failedCount++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Row ${i + 1}: ${errorMsg}`);
        }
      }

      setResults({ success: successCount, failed: failedCount, errors });
      if (successCount > 0) {
        onImportComplete();
      }
    } catch (error) {
      setResults({
        success: 0,
        failed: 0,
        errors: ['Failed to parse CSV file. Please check the format.']
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const template = 'firstname,lastname,username,email,password,role,status,department,phone\nJohn,Doe,johndoe,john@example.com,password123,user,active,Engineering,+1234567890\nJane,Smith,janesmith,jane@example.com,password456,user,active,Marketing,+1234567891';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidates_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Upload className="w-4 h-4" />
        Import CSV
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Candidates from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to bulk import candidates. Make sure the file includes the required columns.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Download Template</p>
                <p className="text-sm text-muted-foreground">
                  Get a sample CSV file with the correct format
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            {/* Required Format */}
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Required Columns:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>firstname</strong> - First name (required)</li>
                <li>• <strong>lastname</strong> - Last name (required)</li>
                <li>• <strong>username</strong> - Username (required, must be unique)</li>
                <li>• <strong>email</strong> - Email address (required, must be unique)</li>
                <li>• <strong>password</strong> - Password (required)</li>
                <li>• <strong>role</strong> - admin or user (optional, defaults to user)</li>
                <li>• <strong>status</strong> - active, inactive, or suspended (optional, defaults to active)</li>
                <li>• <strong>department</strong> - Department name (optional)</li>
                <li>• <strong>phone</strong> - Phone number (optional)</li>
              </ul>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button
                  type="button"
                  className="w-full"
                  disabled={importing}
                  onClick={() => fileInputRef.current?.click()}
                  asChild
                >
                  <span className="gap-2">
                    <Upload className="w-4 h-4" />
                    {importing ? 'Importing...' : 'Select CSV File'}
                  </span>
                </Button>
              </label>
            </div>

            {/* Results */}
            {results && (
              <div className="space-y-2">
                {results.success > 0 && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription>
                      Successfully imported {results.success} candidate{results.success > 1 ? 's' : ''}
                    </AlertDescription>
                  </Alert>
                )}

                {results.failed > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to import {results.failed} candidate{results.failed > 1 ? 's' : ''}
                      {results.errors.length > 0 && (
                        <div className="mt-2 text-xs max-h-32 overflow-y-auto">
                          {results.errors.slice(0, 5).map((error, i) => (
                            <div key={i}>• {error}</div>
                          ))}
                          {results.errors.length > 5 && (
                            <div>... and {results.errors.length - 5} more errors</div>
                          )}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
