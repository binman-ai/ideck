import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { DeckAnalysisService } from '../services/deckAnalysisService';
import { colors, typography, spacing, borderRadius, shadows } from '../config';
import { DeckAnalysis } from '../types';

interface Props {
  navigation: any;
}

export const DeckUploadScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const deckAnalysisService = DeckAnalysisService.getInstance();

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setSelectedFile(result);
      }
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const handleAnalyzeDeck = async () => {
    if (!selectedFile || !user) {
      Alert.alert('Error', 'Please select a file and ensure you are logged in.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Extract text from PDF
      const deckText = await deckAnalysisService.extractTextFromPDF(selectedFile.uri);
      setUploadProgress(95);

      // Analyze the deck
      const analysis: DeckAnalysis = await deckAnalysisService.analyzeDeck({
        deckText,
        fileName: selectedFile.name,
        userId: user.id,
      });

      setUploadProgress(100);
      clearInterval(progressInterval);

      // Navigate to analysis results
      navigation.navigate('Analysis', { analysisId: analysis.id, analysis });
    } catch (error: any) {
      console.error('Analysis error:', error);
      Alert.alert('Error', error.message || 'Failed to analyze deck. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleInteractiveForm = () => {
    navigation.navigate('InteractiveForm');
  };

  const renderUploadArea = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={200}
      style={styles.uploadArea}
    >
      <TouchableOpacity
        style={[
          styles.uploadBox,
          selectedFile && styles.uploadBoxSelected,
        ]}
        onPress={handleFilePicker}
        disabled={isAnalyzing}
      >
        <View style={styles.uploadContent}>
          {selectedFile ? (
            <>
              <Ionicons
                name="document-text"
                size={48}
                color={colors.success}
                style={styles.uploadIcon}
              />
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
              <Text style={styles.changeFileText}>Tap to change file</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="cloud-upload-outline"
                size={48}
                color={colors.primary}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadTitle}>Upload Your Investor Deck</Text>
              <Text style={styles.uploadSubtitle}>
                Drag and drop your PDF file here, or tap to browse
              </Text>
              <Text style={styles.fileRequirements}>
                PDF files only • Max 10MB
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {isAnalyzing && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={[styles.progressFill, { width: `${uploadProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {uploadProgress < 50 
              ? 'Uploading deck...' 
              : uploadProgress < 95 
              ? 'Extracting content...' 
              : 'Analyzing with AI...'}
          </Text>
        </View>
      )}
    </Animatable.View>
  );

  const renderAnalyzeButton = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      style={styles.buttonContainer}
    >
      <Button
        title={isAnalyzing ? 'Analyzing...' : 'Analyze My Deck'}
        onPress={handleAnalyzeDeck}
        loading={isAnalyzing}
        disabled={!selectedFile || isAnalyzing}
        fullWidth
        variant="gradient"
        size="large"
        icon={
          !isAnalyzing && (
            <Ionicons name="analytics" size={20} color={colors.background} />
          )
        }
      />
    </Animatable.View>
  );

  const renderAlternativeOption = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={600}
      style={styles.alternativeContainer}
    >
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.alternativeCard}>
        <Ionicons
          name="chatbubbles-outline"
          size={32}
          color={colors.secondary}
          style={styles.alternativeIcon}
        />
        <Text style={styles.alternativeTitle}>
          Don't have a deck yet?
        </Text>
        <Text style={styles.alternativeDescription}>
          Answer a few questions and we'll create a professional investor deck for you
        </Text>
        <Button
          title="Start Interactive Form"
          onPress={handleInteractiveForm}
          variant="outline"
          fullWidth
          icon={<Ionicons name="arrow-forward" size={16} color={colors.primary} />}
          iconPosition="right"
        />
      </View>
    </Animatable.View>
  );

  const renderFeatures = () => (
    <Animatable.View
      animation="fadeInUp"
      delay={800}
      style={styles.featuresContainer}
    >
      <Text style={styles.featuresTitle}>What you'll get:</Text>
      <View style={styles.featuresList}>
        {[
          'Investment readiness score (0-100)',
          'Detailed analysis of 9 key areas',
          'Actionable improvement recommendations',
          'Investor matching suggestions',
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.success}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.title}>Analyze Your Investor Deck</Text>
          <Text style={styles.subtitle}>
            Get instant feedback using Indihub's proprietary methodology
          </Text>
        </Animatable.View>

        {renderUploadArea()}
        {renderAnalyzeButton()}
        {renderAlternativeOption()}
        {renderFeatures()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  uploadArea: {
    marginBottom: spacing.xl,
  },
  uploadBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },
  uploadBoxSelected: {
    borderColor: colors.success,
    borderStyle: 'solid',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: spacing.md,
  },
  uploadTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  fileRequirements: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
  },
  fileName: {
    ...typography.h3,
    color: colors.success,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  fileSize: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  changeFileText: {
    ...typography.caption,
    color: colors.primary,
  },
  progressContainer: {
    marginTop: spacing.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
  alternativeContainer: {
    marginBottom: spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  alternativeCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },
  alternativeIcon: {
    marginBottom: spacing.md,
  },
  alternativeTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  alternativeDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  featuresContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.sm,
  },
  featuresTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
});