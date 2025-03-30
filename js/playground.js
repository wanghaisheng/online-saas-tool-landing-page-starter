import config from './config.js';
import i18n from './i18n.js';

class Playground {
    constructor() {
        this.elements = {
            inputText: null,
            processBtn: null,
            clearBtn: null,
            resultContent: null,
            timeStat: null,
            wordStat: null,
            accuracyStat: null,
            copyBtn: null,
            downloadBtn: null,
            optionCheckboxes: {}
        };
        this.processing = false;
        this.options = JSON.parse(JSON.stringify(config.playground.options)); // Clone options
    }

    init() {
        this.getElements();
        this.addEventListeners();
        this.updateStats(0, 0, 0);
    }

    getElements() {
        this.elements.inputText = document.getElementById('input-text');
        this.elements.processBtn = document.getElementById('process-btn');
        this.elements.clearBtn = document.getElementById('clear-btn');
        this.elements.resultContent = document.getElementById('result-content');
        this.elements.timeStat = document.getElementById('time-stat');
        this.elements.wordStat = document.getElementById('word-stat');
        this.elements.accuracyStat = document.getElementById('accuracy-stat');
        this.elements.copyBtn = document.getElementById('copy-btn');
        this.elements.downloadBtn = document.getElementById('download-btn');

        // Get option checkboxes
        this.elements.optionCheckboxes.advancedAnalysis = document.getElementById('option1');
        this.elements.optionCheckboxes.detailedReport = document.getElementById('option2');
        this.elements.optionCheckboxes.aiEnhancement = document.getElementById('option3');
    }

    addEventListeners() {
        this.elements.processBtn.addEventListener('click', () => this.processText());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        this.elements.copyBtn.addEventListener('click', () => this.copyResult());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadResult());

        // Add change listeners to options
        Object.keys(this.elements.optionCheckboxes).forEach(option => {
            this.elements.optionCheckboxes[option].addEventListener('change', (e) => {
                this.options[option] = e.target.checked;
            });
        });
    }

    processText() {
        if (this.processing) return;
        
        const inputText = this.elements.inputText.value.trim();
        if (!inputText) {
            this.showPlaceholder(i18n.getTranslation('playground.errorEmptyInput'));
            return;
        }

        this.processing = true;
        this.elements.processBtn.disabled = true;
        this.elements.processBtn.classList.add('processing');
        this.elements.processBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${i18n.getTranslation('playground.processing')}`;

        // Simulate processing delay
        setTimeout(() => {
            // Count words
            const wordCount = this.countWords(inputText);
            
            // Calculate processing time based on word count and options
            let processingTime = (wordCount / 200) * config.playground.processingTime;
            if (this.options.advancedAnalysis) processingTime *= 1.2;
            if (this.options.detailedReport) processingTime *= 1.5;
            if (this.options.aiEnhancement) processingTime *= 2;
            processingTime = Math.min(processingTime, 5); // Cap at 5 seconds
            processingTime = Math.max(processingTime, 0.5); // Min 0.5 seconds
            
            // Calculate accuracy based on options
            let accuracy = config.playground.accuracy;
            if (this.options.advancedAnalysis) accuracy += 1;
            if (this.options.aiEnhancement) accuracy += 0.5;
            accuracy = Math.min(accuracy, 99.9); // Cap at 99.9%

            // Update stats
            this.updateStats(processingTime.toFixed(1), wordCount, accuracy.toFixed(1));
            
            // Generate and display result
            const result = this.generateResult(inputText);
            this.elements.resultContent.innerHTML = result;
            
            // Reset processing state
            this.processing = false;
            this.elements.processBtn.disabled = false;
            this.elements.processBtn.classList.remove('processing');
            this.elements.processBtn.innerHTML = i18n.getTranslation('playground.processBtn');
        }, 1000); // Simulate 1 second of processing
    }

    generateResult(inputText) {
        // Basic content
        let result = `<div class="result-text">`;
        
        // Sample result
        result += config.playground.sampleResult;
        
        // Add advanced analysis if selected
        if (this.options.advancedAnalysis) {
            result += `<div class="analysis-section">
                <h4>${i18n.getTranslation('playground.analysis.title')}</h4>
                <p>${i18n.getTranslation('playground.analysis.content')}</p>
                <div class="analysis-chart">
                    <div class="chart-bar" style="width: 75%;">
                        <span>${i18n.getTranslation('playground.analysis.sentiment')}: 75%</span>
                    </div>
                </div>
            </div>`;
        }
        
        // Add detailed report if selected
        if (this.options.detailedReport) {
            result += `<div class="report-section">
                <h4>${i18n.getTranslation('playground.report.title')}</h4>
                <ul class="report-list">
                    <li>${i18n.getTranslation('playground.report.item1')}</li>
                    <li>${i18n.getTranslation('playground.report.item2')}</li>
                    <li>${i18n.getTranslation('playground.report.item3')}</li>
                </ul>
            </div>`;
        }
        
        // Add AI enhancement if selected
        if (this.options.aiEnhancement) {
            result += `<div class="ai-section">
                <h4>${i18n.getTranslation('playground.ai.title')}</h4>
                <p>${i18n.getTranslation('playground.ai.content')}</p>
                <div class="ai-suggestion">
                    <i class="fas fa-lightbulb"></i>
                    <span>${i18n.getTranslation('playground.ai.suggestion')}</span>
                </div>
            </div>`;
        }
        
        result += `</div>`;
        return result;
    }

    clearAll() {
        this.elements.inputText.value = '';
        this.showPlaceholder(i18n.getTranslation('playground.resultPlaceholder'));
        this.updateStats(0, 0, 0);
    }

    showPlaceholder(message) {
        this.elements.resultContent.innerHTML = `<div class="placeholder-content">${message}</div>`;
    }

    copyResult() {
        const resultText = this.elements.resultContent.innerText;
        if (!resultText || resultText === i18n.getTranslation('playground.resultPlaceholder')) {
            return;
        }

        navigator.clipboard.writeText(resultText).then(() => {
            const originalIcon = this.elements.copyBtn.innerHTML;
            this.elements.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.elements.copyBtn.innerHTML = originalIcon;
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }

    downloadResult() {
        const resultText = this.elements.resultContent.innerText;
        if (!resultText || resultText === i18n.getTranslation('playground.resultPlaceholder')) {
            return;
        }

        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'processed-result.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    countWords(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    updateStats(time, words, accuracy) {
        this.elements.timeStat.textContent = `${time}s`;
        this.elements.wordStat.textContent = words;
        this.elements.accuracyStat.textContent = `${accuracy}%`;
    }
}

export default new Playground();

