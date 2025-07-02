import React from 'react';
import { Sparkles, Users, Link as LinkIcon, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSectionProps {
  username?: string;
  onCreateMeeting: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  username,
  onCreateMeeting,
  onToggleFilters,
  showFilters
}) => {
  const { t } = useLanguage();

  const heroStats = [
    { icon: Users, label: t('meetings.activeUsers'), value: '1.2K+', color: 'ios-blue' },
    { icon: LinkIcon, label: t('meetings.totalMeetings'), value: '5.8K+', color: 'ios-green' },
    { icon: Calendar, label: t('meetings.thisMonth'), value: '342', color: 'ios-purple' }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ios-blue/10 via-ios-purple/10 to-ios-pink/10"></div>
      <div className="relative container py-ios-2xl">
        <div className="text-center space-y-ios-lg max-w-4xl mx-auto">
          <div className="space-y-ios-md">
            <div className="inline-flex items-center gap-2 bg-ios-secondary-bg/80 backdrop-blur-sm rounded-full px-ios-md py-ios-sm border border-ios-gray-4/50 shadow-ios-sm">
              <Sparkles className="h-4 w-4 text-ios-blue" />
              <span className="ios-text-footnote font-semibold text-ios-secondary-label">
                {t('meetings.welcomeBack')} {username}
              </span>
            </div>
            
            <h1 className="ios-text-title-1 font-bold text-ios-label leading-tight">
              {t('meetings.heroTitle')}
            </h1>
            
            <p className="ios-text-body text-ios-secondary-label max-w-2xl mx-auto leading-relaxed">
              {t('meetings.heroSubtitle')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-ios-md max-w-2xl mx-auto">
            {heroStats.map((stat, index) => (
              <Card key={index} className="bg-ios-secondary-bg/60 backdrop-blur-sm border border-ios-gray-5/50 rounded-ios-xl shadow-ios-sm hover:shadow-ios-md transition-all duration-300">
                <CardContent className="p-ios-md text-center">
                  <div className={`w-10 h-10 bg-${stat.color}/10 rounded-ios-lg flex items-center justify-center mx-auto mb-ios-sm`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                  </div>
                  <div className="ios-text-title-3 font-bold text-ios-label">{stat.value}</div>
                  <div className="ios-text-caption text-ios-secondary-label">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-ios-sm justify-center">
            <Button
              onClick={onCreateMeeting}
              className="bg-ios-blue hover:bg-ios-blue-dark text-white rounded-ios-lg px-ios-lg py-ios-md font-semibold shadow-ios-md hover:shadow-ios-lg transition-all duration-200 ios-spring"
            >
              <span className="h-5 w-5 mr-2">+</span>
              {t('meetings.createNew')}
            </Button>
            
            <Button
              onClick={onToggleFilters}
              variant="outline"
              className="bg-ios-secondary-bg/80 hover:bg-ios-gray-6 text-ios-label border-ios-gray-4 rounded-ios-lg px-ios-lg py-ios-md font-semibold transition-all duration-200 ios-spring"
            >
              <span className="h-5 w-5 mr-2">⚹</span>
              {t('meetings.filters')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;