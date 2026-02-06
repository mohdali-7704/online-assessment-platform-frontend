import { userService } from '@/lib/services/userService';
import { CreateUserInput } from '@/lib/types/user';

export interface CSVImportResult {
  successCount: number;
  errorCount: number;
  errors: string[];
}

export function importUsersFromCSV(
  file: File,
  onComplete: (result: CSVImportResult) => void
): void {
  const reader = new FileReader();

  reader.onload = (e) => {
    const text = e.target?.result as string;
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      onComplete({
        successCount: 0,
        errorCount: 0,
        errors: ['CSV file is empty or invalid']
      });
      return;
    }

    // Skip header row (username,firstName,lastName,email,password,role,status,department,phone)
    const dataLines = lines.slice(1);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    dataLines.forEach((line, index) => {
      const [username, firstName, lastName, email, password, role, status, department, phone] =
        line.split(',').map(s => s.trim());

      try {
        if (!username || !firstName || !lastName || !email) {
          throw new Error(`Missing required fields (username, firstName, lastName, email)`);
        }

        const newUser: CreateUserInput = {
          username,
          firstName,
          lastName,
          email,
          password: password || 'Password123!', // Default password if not provided
          role: (role?.toLowerCase() as 'admin' | 'user') || 'user',
          status: (status?.toLowerCase() as 'active' | 'inactive' | 'suspended') || 'active',
          department: department || undefined,
          phone: phone || undefined
        };

        userService.createUser(newUser);
        successCount++;
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Line ${index + 2}: ${errorMessage}`);
      }
    });

    onComplete({ successCount, errorCount, errors });
  };

  reader.onerror = () => {
    onComplete({
      successCount: 0,
      errorCount: 0,
      errors: ['Failed to read the file']
    });
  };

  reader.readAsText(file);
}

export function downloadCSVTemplate(): void {
  const csvContent = 'username,firstName,lastName,email,password,role,status,department,phone\njohndoe,John,Doe,john@example.com,Password123!,user,active,Engineering,+1234567890';
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'candidate_import_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
