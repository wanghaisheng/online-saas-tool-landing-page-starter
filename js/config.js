/* @tweakable primary color of the theme */
const config = {
    theme: {
        primaryColor: "#4F46E5",
        primaryHover: "#4338CA",
        primaryLight: "#E0E7FF",
        secondaryColor: "#10B981",
        secondaryHover: "#059669"
    },
    /* @tweakable text processing options */
    playground: {
        processingTime: 1.2, // seconds
        wordCount: 250,
        accuracy: 98.5,
        /* @tweakable sample result text */
        sampleResult: "This is a sample processed result. In a real implementation, this would be the actual output from your processing algorithm. The text would be formatted and styled according to your requirements, and may include additional data visualizations or structured information.",
        /* @tweakable processing options */
        options: {
            advancedAnalysis: true,
            detailedReport: false,
            aiEnhancement: false
        }
    },
    /* @tweakable pricing details */
    pricing: {
        monthly: {
            basic: 19,
            pro: 49,
            enterprise: 99
        },
        annually: {
            basic: 15,
            pro: 39,
            enterprise: 79
        },
        /* @tweakable discount percentage shown in the badge */
        discountPercentage: 20
    },
    /* @tweakable default language */
    defaultLanguage: "en",
    /* @tweakable supported languages */
    supportedLanguages: ["en", "es", "fr", "de", "zh"],
    /* @tweakable language display names */
    languageNames: {
        en: "English",
        es: "Español",
        fr: "Français",
        de: "Deutsch",
        zh: "中文"
    },
    /* @tweakable SEO settings */
    seo: {
        /* @tweakable main keywords */
        mainKeywords: ["text analysis tool", "AI text processing", "content enhancement", "text optimization"],
        /* @tweakable meta description length */
        metaDescriptionMaxLength: 160,
        /* @tweakable image optimization settings */
        imageOptimization: {
            lazyLoading: true,
            useWebp: true,
            defaultAltText: "AI text analysis and enhancement tool"
        }
    },
    /* @tweakable trust indicators */
    trustIndicators: {
        /* @tweakable customer count */
        customerCount: "10,000+",
        /* @tweakable reviews count */
        reviewsCount: "2,000+",
        /* @tweakable average rating */
        averageRating: 4.9,
        /* @tweakable certifications */
        certifications: ["ISO 27001", "GDPR Compliant", "SOC 2"]
    }
};

export default config;