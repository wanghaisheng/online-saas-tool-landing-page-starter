import config from './config.js';

class AIImageGenerator {
    constructor() {
        this.elements = {
            promptInput: null,
            styleSelect: null,
            ratioSelect: null,
            generateBtn: null,
            clearBtn: null,
            resultContainer: null,
            downloadBtn: null,
            shareBtn: null,
            generationTime: null,
            imageResolution: null
        };
        
        /* @tweakable maximum generation time in seconds */
        this.maxGenerationTime = 5;
        
        /* @tweakable minimum generation time in seconds */
        this.minGenerationTime = 1.5;
        
        /* @tweakable default image resolution width */
        this.defaultWidth = 1024;
        
        /* @tweakable default image resolution height */
        this.defaultHeight = 1024;
        
        /* @tweakable example prompts for placeholder */
        this.examplePrompts = [
            "A serene mountain landscape with a lake at sunset",
            "A futuristic city with flying cars and neon lights",
            "A photorealistic portrait of an astronaut in space",
            "An abstract painting with vibrant colors and geometric shapes"
        ];
        
        this.isGenerating = false;
        this.currentImage = null;
    }

    init() {
        this.getElements();
        this.addEventListeners();
        this.setRandomPlaceholder();
    }

    getElements() {
        this.elements.promptInput = document.getElementById('image-prompt');
        this.elements.styleSelect = document.getElementById('image-style');
        this.elements.ratioSelect = document.getElementById('image-ratio');
        this.elements.generateBtn = document.getElementById('generate-image-btn');
        this.elements.clearBtn = document.getElementById('clear-image-btn');
        this.elements.resultContainer = document.getElementById('image-result-container');
        this.elements.downloadBtn = document.getElementById('download-image-btn');
        this.elements.shareBtn = document.getElementById('share-image-btn');
        this.elements.generationTime = document.getElementById('generation-time');
        this.elements.imageResolution = document.getElementById('image-resolution');
    }

    addEventListeners() {
        this.elements.generateBtn.addEventListener('click', () => this.generateImage());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.elements.shareBtn.addEventListener('click', () => this.shareImage());
        this.elements.ratioSelect.addEventListener('change', () => this.updateResolutionDisplay());
    }

    setRandomPlaceholder() {
        const randomIndex = Math.floor(Math.random() * this.examplePrompts.length);
        this.elements.promptInput.placeholder = this.examplePrompts[randomIndex];
    }

    updateResolutionDisplay() {
        const ratio = this.elements.ratioSelect.value;
        let width, height;
        
        switch(ratio) {
            case '16:9':
                width = this.defaultWidth;
                height = Math.floor(this.defaultWidth * (9/16));
                break;
            case '4:3':
                width = this.defaultWidth;
                height = Math.floor(this.defaultWidth * (3/4));
                break;
            case '9:16':
                height = this.defaultWidth;
                width = Math.floor(this.defaultWidth * (9/16));
                break;
            default: // 1:1
                width = this.defaultWidth;
                height = this.defaultWidth;
        }
        
        this.elements.imageResolution.textContent = `${width}×${height}`;
    }

    async generateImage() {
        if (this.isGenerating) return;
        
        const prompt = this.elements.promptInput.value.trim();
        if (!prompt) {
            this.showPlaceholder('Please enter a prompt to generate an image');
            return;
        }

        this.isGenerating = true;
        this.elements.generateBtn.disabled = true;
        this.elements.generateBtn.classList.add('processing');
        this.elements.generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating...`;
        
        // Show loading state
        this.elements.resultContainer.innerHTML = `
            <div class="generation-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Creating your image...</p>
            </div>
        `;
        
        try {
            // Calculate a "realistic" generation time
            const style = this.elements.styleSelect.value;
            const ratio = this.elements.ratioSelect.value;
            
            // Different styles and ratios affect generation time
            let complexityFactor = 1;
            if (style === 'realistic') complexityFactor = 1.2;
            if (style === '3d') complexityFactor = 1.3;
            if (ratio !== '1:1') complexityFactor *= 1.1;
            
            // Simulate generation time based on prompt length and complexity
            const baseTime = this.minGenerationTime;
            const randomFactor = Math.random() * (this.maxGenerationTime - this.minGenerationTime);
            const generationTime = (baseTime + randomFactor) * complexityFactor;
            
            // Get dimensions based on selected ratio
            const dimensions = this.getImageDimensions(ratio);
            
            // Start actual generation if API is available
            if (typeof websim !== 'undefined' && websim.imageGen) {
                try {
                    const result = await websim.imageGen({
                        prompt: prompt,
                        aspect_ratio: ratio,
                    });
                    
                    // If generation successful, display the image
                    if (result && result.url) {
                        this.displayGeneratedImage(result.url, dimensions, generationTime);
                        return;
                    }
                } catch (error) {
                    console.error("Error generating image:", error);
                    // Continue with fallback behavior
                }
            }
            
            // Fallback: simulate with timeout and placeholder image
            setTimeout(() => {
                // Create a placeholder image with the prompt text
                const placeholderImage = this.createPlaceholderImage(prompt, dimensions.width, dimensions.height);
                this.displayGeneratedImage(placeholderImage, dimensions, generationTime);
            }, generationTime * 1000);
            
        } catch (error) {
            console.error("Error in image generation:", error);
            this.showPlaceholder('An error occurred during image generation. Please try again.');
            this.isGenerating = false;
            this.elements.generateBtn.disabled = false;
            this.elements.generateBtn.classList.remove('processing');
            this.elements.generateBtn.textContent = 'Generate Image';
        }
    }
    
    getImageDimensions(ratio) {
        let width, height;
        
        switch(ratio) {
            case '16:9':
                width = this.defaultWidth;
                height = Math.floor(this.defaultWidth * (9/16));
                break;
            case '4:3':
                width = this.defaultWidth;
                height = Math.floor(this.defaultWidth * (3/4));
                break;
            case '9:16':
                height = this.defaultWidth;
                width = Math.floor(this.defaultWidth * (9/16));
                break;
            default: // 1:1
                width = this.defaultWidth;
                height = this.defaultWidth;
        }
        
        return { width, height };
    }
    
    createPlaceholderImage(prompt, width, height) {
        // Create a simplified svg with the prompt as text
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="${width}" height="${height}" fill="#E0E7FF"/>
                <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="#F9FAFB" rx="8"/>
                <text x="50%" y="45%" font-family="Arial" font-size="${width * 0.03}px" fill="#4F46E5" text-anchor="middle">AI Generated Image Preview</text>
                <text x="50%" y="55%" font-family="Arial" font-size="${width * 0.02}px" fill="#6B7280" text-anchor="middle" text-length="30">"${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"</text>
            </svg>
        `;
        
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
    
    displayGeneratedImage(imageUrl, dimensions, generationTime) {
        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = "AI generated image";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "300px";
        img.style.borderRadius = "var(--radius-sm)";
        
        // Clear container and add image
        this.elements.resultContainer.innerHTML = '';
        this.elements.resultContainer.appendChild(img);
        
        // Update stats
        this.elements.generationTime.textContent = `${generationTime.toFixed(1)}s`;
        this.elements.imageResolution.textContent = `${dimensions.width}×${dimensions.height}`;
        
        // Save current image data
        this.currentImage = {
            url: imageUrl,
            prompt: this.elements.promptInput.value.trim()
        };
        
        // Reset button
        this.isGenerating = false;
        this.elements.generateBtn.disabled = false;
        this.elements.generateBtn.classList.remove('processing');
        this.elements.generateBtn.textContent = 'Generate Image';
    }

    clearAll() {
        this.elements.promptInput.value = '';
        this.showPlaceholder('Your generated image will appear here');
        this.setRandomPlaceholder();
        this.elements.generationTime.textContent = '0.0s';
        this.updateResolutionDisplay();
        this.currentImage = null;
    }

    showPlaceholder(message) {
        this.elements.resultContainer.innerHTML = `<div class="placeholder-content">${message}</div>`;
    }

    downloadImage() {
        if (!this.currentImage) return;
        
        const a = document.createElement('a');
        a.href = this.currentImage.url;
        a.download = `ai-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    shareImage() {
        if (!this.currentImage) return;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: 'AI Generated Image',
                text: `Check out this AI-generated image based on the prompt: "${this.currentImage.prompt}"`,
                url: this.currentImage.url
            }).catch(error => {
                console.error('Error sharing:', error);
            });
        } else {
            // Fallback to copy to clipboard
            navigator.clipboard.writeText(this.currentImage.url).then(() => {
                alert('Image URL copied to clipboard!');
            }).catch(err => {
                console.error('Error copying to clipboard:', err);
            });
        }
    }
}

export default new AIImageGenerator();