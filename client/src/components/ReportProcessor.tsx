'use client'
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

interface ProportionData {
  TBL: string;
  TD: string;
  CA: string;
  PA: string;
  ST: string;
  LH: string;
  reportType: string;
  address: string;
  cityState: string;
  country: string;
  girdle: string;
  culet: string;
  depth: string;
  table: string;
  // clarityCharacteristics: string;
  pdfname: string;
}

export const BASE_URL = "http://localhost:8000";

const ReportProcessor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proportions, setProportions] = useState<ProportionData>({
    TBL: '',
    TD: '',
    CA: '',
    PA: '',
    ST: '',
    LH: '',
    depth: '',
    table: '',
    reportType: 'Diamond Grading Report',
    address: 'Plot No C-70 Bkc, Bandra (E)',
    cityState: 'Mumbai, MH 400051',
    country: 'India',
    girdle: '',
    culet: 'NON',
    pdfname: '',
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error("Invalid file type", {
          // description: "Please upload a PDF file only."
        });
        return;
      }
      setUploadedFile(file);
      toast.success("File uploaded successfully", {
        // description: "Your PDF is ready for processing"
      });
    }
  };

  const handleProportionChange = (field: keyof ProportionData, value: string) => {
    setProportions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!uploadedFile) {
      toast.warning("Please upload a PDF file", {
        // description: "Please upload a PDF file before submitting"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile!);
      formData.append('proportions', JSON.stringify(proportions));

      const response = await axios.post(`${BASE_URL}/upload-multi-pdf/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const mergedData = {
        ...response.data,
        ...proportions,
      };
      console.log("mergedData", mergedData)



      // Get current date in DD/MM/YYYY format
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      // Create the file name with the format reportNumber-DD/MM/YYYY
      // const fileName = `${mergedData.GIANATURALDIAMONDGRADINGREPORT?.GIAReportNumber}/${formattedDate}.pdf`;
      let fileName = `${mergedData.GIANATURALDIAMONDGRADINGREPORT?.GIAReportNumber}/${formattedDate}.pdf`;

      if (proportions.pdfname && proportions.pdfname.trim() !== '') {
        fileName = `${mergedData.GIANATURALDIAMONDGRADINGREPORT?.GIAReportNumber}/${formattedDate}-${proportions.pdfname.trim()}.pdf`;
      }

      const blob = await pdf(<InvoicePDF data={mergedData} />).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // a.download = `Report-${Date.now()}.pdf`;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Report processed successfully!",
        //   {
        //   description: "Your PDF has been generated and downloaded"
        // }
      );

      // Reset input field so user can re-upload same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadedFile(null);
      setProportions({
        TBL: '',
        TD: '',
        CA: '',
        PA: '',
        ST: '',
        LH: '',
        depth: '',
        table: '',
        reportType: 'Diamond Grading Report',
        address: 'Plot No C-70 Bkc, Bandra (E)',
        cityState: 'Mumbai, MH 400051',
        country: 'India',
        girdle: '',
        culet: 'NON',
        pdfname: ''
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Processing failed. ${error.code === "ERR_NETWORK" ? "Back-end not connected" : "Unable to process your document. Please try again"}`);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6 relative">
      {/* Full Screen Loader */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Processing Report</h3>
              <p className="text-sm text-muted-foreground">Please wait while we process your document...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Report Processor</h1>
          <p className="text-muted-foreground">Upload your PDF and configure proportion data</p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Report Configuration
            </CardTitle>
            <CardDescription>
              Configure your report type and upload the required PDF document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PDF Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdf-upload" className="text-sm font-medium">
                PDF Document
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent/50 transition-colors">
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {uploadedFile ? 'Change PDF file' : 'Click to upload PDF'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF files only, max 10MB
                  </span>
                </Label>
              </div>
              {uploadedFile && (
                <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm text-success-foreground">
                    {uploadedFile.name}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle>Proportion Data</CardTitle>
            <CardDescription>
              Enter the proportion values for each measurement category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* {Object.entries(proportions).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium">
                      {key}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      step="0.01"
                      value={value}
                      onChange={(e) => handleProportionChange(key as keyof ProportionData, e.target.value)}
                      placeholder={`Enter ${key} value`}
                      className="transition-all focus:shadow-soft"
                    />
                  </div>
                ))} */}
                {Object.entries(proportions).map(([key, value]) => {
                  const isNumericField = ['TD', 'TBL', 'CA', 'PA', 'ST', 'LH', 'depth', 'table'].includes(key);

                  return (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-sm font-medium">
                        {key}
                      </Label>
                      <Input
                        id={key}
                        type={isNumericField ? 'number' : 'text'}
                        step={isNumericField ? '0.01' : undefined}
                        value={value}
                        onChange={(e) => handleProportionChange(key as keyof ProportionData, e.target.value)}
                        placeholder={`Enter ${key} value`}
                        className="transition-all focus:shadow-soft"
                      />
                    </div>
                  );
                })}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportProcessor;