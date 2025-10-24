'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGenerateWebsite } from '@/lib/hooks';
import { LoadingSpinner, ProgressBar } from '@/components/ui/loading';
import { Wand2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const generateSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters long'),
  title: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

type GenerateFormData = z.infer<typeof generateSchema>;

const examplePrompts = [
  "Create a modern portfolio website for a photographer with a dark theme, gallery section, and contact form",
  "Build a landing page for a tech startup with hero section, features, pricing, and testimonials",
  "Design a restaurant website with menu, reservations, location, and beautiful food photography",
  "Create a blog website for a travel blogger with clean design, article grid, and social media integration",
  "Build an e-commerce site for handmade jewelry with product showcase, shopping cart, and checkout",
];

export function GenerateForm() {
  const generateWebsite = useGenerateWebsite();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GenerateFormData>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      prompt: '',
      title: '',
      description: '',
      isPublic: false,
    },
  });

  const isPublic = watch('isPublic');
  const prompt = watch('prompt');

  const onSubmit = async (data: GenerateFormData) => {
    try {
      await generateWebsite.mutateAsync(data);
      toast.success('Website generated successfully!');
      
      // Reset form
      setValue('prompt', '');
      setValue('title', '');
      setValue('description', '');
      setValue('isPublic', false);
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      
      let errorMessage = 'Failed to generate website';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 400) {
          // Use the improved backend error message
          errorMessage = axiosError.response?.data?.message || 'Invalid request. Please check your input and try again.';
          
          // Add suggestions if available
          if (axiosError.response?.data?.details?.suggestions) {
            errorMessage += ` Suggestions: ${axiosError.response.data.details.suggestions.join(', ')}`;
          }
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (axiosError.response?.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (axiosError.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleExampleClick = (example: string) => {
    setValue('prompt', example);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">
          Generate Your Website
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Describe your vision and let AI create a beautiful website for you
        </p>
      </div>

      {/* Example Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Example Prompts</span>
          </CardTitle>
          <CardDescription>
            Click on any example to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {examplePrompts.map((example, index) => (
              <div
                key={index}
                className="p-6 border border-border rounded-lg bg-background hover:bg-accent/50 hover:border-accent transition-all cursor-pointer min-h-[120px] flex items-start group"
                onClick={() => handleExampleClick(example)}
              >
                <div className="text-sm leading-relaxed text-foreground group-hover:text-accent-foreground break-words">
                  {example}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Website Details</CardTitle>
          <CardDescription>
            Provide details about the website you want to create
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Prompt */}
            <div className="space-y-3">
              <Label htmlFor="prompt" className="text-base font-medium">Website Prompt *</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the website you want to create..."
                className="min-h-[140px] text-base"
                {...register('prompt')}
              />
              {errors.prompt && (
                <p className="text-sm text-destructive">{errors.prompt.message}</p>
              )}
            </div>

            {/* Title and Description */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-medium">Website Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="My Awesome Website"
                  className="text-base"
                  {...register('title')}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="A brief description of your website"
                  className="text-base"
                  {...register('description')}
                />
              </div>
            </div>

            {/* Public Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setValue('isPublic', checked)}
              />
              <Label htmlFor="isPublic" className="text-base">
                Make this website public (visible to others)
              </Label>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold"
                disabled={generateWebsite.isPending || !prompt.trim()}
              >
                {generateWebsite.isPending ? (
                  <>
                    <LoadingSpinner className="mr-3" />
                    Generating Website...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-3" />
                    Generate Website
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {generateWebsite.isPending && (
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="font-medium">Generating your website...</span>
                <span className="text-muted-foreground">Processing...</span>
              </div>
              <ProgressBar progress={50} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
