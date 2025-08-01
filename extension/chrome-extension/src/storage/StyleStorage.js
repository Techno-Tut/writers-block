import { CUSTOM_STYLES } from '../utils/constants';
import { validateCustomStyle, sanitizeCustomStyle, isStyleNameUnique } from '../utils/styleValidation';

/**
 * Chrome storage abstraction for custom rewrite styles
 */
class StyleStorage {
  /**
   * Save all styles to Chrome storage
   * @param {Array} styles - Array of style objects
   * @returns {Promise<void>}
   */
  static async saveStyles(styles) {
    try {
      await chrome.storage.local.set({
        [CUSTOM_STYLES.STORAGE_KEY]: styles
      });
      console.log('Styles saved to storage:', styles.length);
    } catch (error) {
      console.error('Failed to save styles:', error);
      throw new Error(`Failed to save styles: ${error.message}`);
    }
  }

  /**
   * Load all styles from Chrome storage
   * @returns {Promise<Array>} - Array of style objects
   */
  static async loadStyles() {
    try {
      const result = await chrome.storage.local.get([CUSTOM_STYLES.STORAGE_KEY]);
      const styles = result[CUSTOM_STYLES.STORAGE_KEY] || CUSTOM_STYLES.DEFAULT_STYLES;
      console.log('Styles loaded from storage:', styles.length);
      return styles;
    } catch (error) {
      console.error('Failed to load styles:', error);
      throw new Error(`Failed to load styles: ${error.message}`);
    }
  }

  /**
   * Add a new style
   * @param {Object} styleData - Style data to add
   * @returns {Promise<Object>} - The created style object
   */
  static async addStyle(styleData) {
    try {
      // Load existing styles
      const existingStyles = await this.loadStyles();

      // Sanitize the new style
      const sanitizedStyle = sanitizeCustomStyle(styleData);

      // Validate the style
      const validation = validateCustomStyle(sanitizedStyle);
      if (!validation.isValid) {
        throw new Error(`Invalid style data: ${validation.errors.join(', ')}`);
      }

      // Check for unique name
      if (!isStyleNameUnique(sanitizedStyle.name, existingStyles)) {
        throw new Error(`A style with the name "${sanitizedStyle.name}" already exists`);
      }

      // Add to existing styles
      const updatedStyles = [...existingStyles, sanitizedStyle];

      // Save to storage
      await this.saveStyles(updatedStyles);

      console.log('Style added:', sanitizedStyle.name);
      return sanitizedStyle;
    } catch (error) {
      console.error('Failed to add style:', error);
      throw error;
    }
  }

  /**
   * Update an existing style
   * @param {string} styleId - ID of the style to update
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} - The updated style object
   */
  static async updateStyle(styleId, updates) {
    try {
      const existingStyles = await this.loadStyles();
      const styleIndex = existingStyles.findIndex(style => style.id === styleId);

      if (styleIndex === -1) {
        throw new Error(`Style with ID "${styleId}" not found`);
      }

      // Create updated style
      const currentStyle = existingStyles[styleIndex];
      const updatedStyle = sanitizeCustomStyle({
        ...currentStyle,
        ...updates,
        id: styleId, // Preserve original ID
        createdAt: currentStyle.createdAt // Preserve creation date
      });

      // Validate updated style
      const validation = validateCustomStyle(updatedStyle);
      if (!validation.isValid) {
        throw new Error(`Invalid style data: ${validation.errors.join(', ')}`);
      }

      // Check for unique name (excluding current style)
      if (!isStyleNameUnique(updatedStyle.name, existingStyles, styleId)) {
        throw new Error(`A style with the name "${updatedStyle.name}" already exists`);
      }

      // Update the styles array
      const updatedStyles = [...existingStyles];
      updatedStyles[styleIndex] = updatedStyle;

      // Save to storage
      await this.saveStyles(updatedStyles);

      console.log('Style updated:', updatedStyle.name);
      return updatedStyle;
    } catch (error) {
      console.error('Failed to update style:', error);
      throw error;
    }
  }

  /**
   * Delete a style
   * @param {string} styleId - ID of the style to delete
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  static async deleteStyle(styleId) {
    try {
      const existingStyles = await this.loadStyles();
      const styleIndex = existingStyles.findIndex(style => style.id === styleId);

      if (styleIndex === -1) {
        throw new Error(`Style with ID "${styleId}" not found`);
      }

      // Remove the style
      const updatedStyles = existingStyles.filter(style => style.id !== styleId);

      // Save to storage
      await this.saveStyles(updatedStyles);

      console.log('Style deleted:', styleId);
      return true;
    } catch (error) {
      console.error('Failed to delete style:', error);
      throw error;
    }
  }

  /**
   * Get a single style by ID
   * @param {string} styleId - ID of the style to retrieve
   * @returns {Promise<Object|null>} - The style object or null if not found
   */
  static async getStyleById(styleId) {
    try {
      const styles = await this.loadStyles();
      const style = styles.find(s => s.id === styleId);
      return style || null;
    } catch (error) {
      console.error('Failed to get style by ID:', error);
      throw error;
    }
  }

  /**
   * Clear all custom styles (for testing/reset)
   * @returns {Promise<void>}
   */
  static async clearAllStyles() {
    try {
      await this.saveStyles([]);
      console.log('All styles cleared');
    } catch (error) {
      console.error('Failed to clear styles:', error);
      throw error;
    }
  }

  /**
   * Get storage usage information
   * @returns {Promise<Object>} - Storage usage stats
   */
  static async getStorageInfo() {
    try {
      const styles = await this.loadStyles();
      const storageData = await chrome.storage.local.get(null);
      const totalKeys = Object.keys(storageData).length;
      
      return {
        styleCount: styles.length,
        totalStorageKeys: totalKeys,
        estimatedSize: JSON.stringify(styles).length
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      throw error;
    }
  }
}

export default StyleStorage;
