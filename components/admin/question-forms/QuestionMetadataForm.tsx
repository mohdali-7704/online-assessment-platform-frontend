import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionDifficulty } from '@/lib/types/question';
import { PREDEFINED_TOPICS, PREDEFINED_DOMAINS } from '@/lib/services/questionBankService';

interface QuestionMetadataFormProps {
  topic: string;
  setTopic: (value: string) => void;
  customTopic: string;
  setCustomTopic: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  customDomain: string;
  setCustomDomain: (value: string) => void;
  difficulty: QuestionDifficulty;
  setDifficulty: (value: QuestionDifficulty) => void;
}

export default function QuestionMetadataForm({
  topic,
  setTopic,
  customTopic,
  setCustomTopic,
  domain,
  setDomain,
  customDomain,
  setCustomDomain,
  difficulty,
  setDifficulty
}: QuestionMetadataFormProps) {
  const topicsWithCustom = [...PREDEFINED_TOPICS, 'Custom'];
  const domainsWithCustom = [...PREDEFINED_DOMAINS, 'Custom'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Difficulty *</Label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as QuestionDifficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>
                <SelectItem value={QuestionDifficulty.MEDIUM}>Medium</SelectItem>
                <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label>Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topicsWithCustom.map(t => (
                  <SelectItem key={t} value={t === 'Custom' ? 'custom' : t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {topic === 'custom' && (
              <Input
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter custom topic"
                className="mt-2"
              />
            )}
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <Label>Domain</Label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                {domainsWithCustom.map(d => (
                  <SelectItem key={d} value={d === 'Custom' ? 'custom' : d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {domain === 'custom' && (
              <Input
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="Enter custom domain"
                className="mt-2"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
