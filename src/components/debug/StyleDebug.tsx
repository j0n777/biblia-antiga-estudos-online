
import { useEffect } from 'react';

const StyleDebug = () => {
  useEffect(() => {
    console.log('=== STYLE DEBUG COMPLETO ===');
    
    // Verificar variáveis CSS
    const rootStyles = window.getComputedStyle(document.documentElement);
    const backgroundVar = rootStyles.getPropertyValue('--background').trim();
    const cardVar = rootStyles.getPropertyValue('--card').trim();
    const borderVar = rootStyles.getPropertyValue('--border').trim();
    
    console.log('🎨 Variáveis CSS:', {
      '--background': backgroundVar,
      '--card': cardVar,
      '--border': borderVar,
      'background-computed': `hsl(${backgroundVar})`,
      'card-computed': `hsl(${cardVar})`,
      'border-computed': `hsl(${borderVar})`
    });
    
    // Verificar elementos body e html
    const bodyStyles = window.getComputedStyle(document.body);
    const htmlStyles = window.getComputedStyle(document.documentElement);
    
    console.log('📄 Body & HTML:', {
      bodyBackground: bodyStyles.backgroundColor,
      bodyColor: bodyStyles.color,
      htmlBackground: htmlStyles.backgroundColor,
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className
    });
    
    // Verificar cards específicos
    const cards = document.querySelectorAll('.card, [class*="card"], .content-box');
    console.log(`🃏 ${cards.length} cards encontrados`);
    
    cards.forEach((card, index) => {
      const styles = window.getComputedStyle(card);
      console.log(`Card ${index}:`, {
        element: card.tagName,
        classes: card.className,
        backgroundColor: styles.backgroundColor,
        border: styles.border,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        position: styles.position
      });
    });

    // Verificar se as folhas de estilo foram carregadas
    const sheets = Array.from(document.styleSheets);
    console.log(`📚 ${sheets.length} StyleSheets carregadas`);
    
    let cardRulesFound = 0;
    sheets.forEach((sheet, sheetIndex) => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        const cardRules = rules.filter(rule => {
          if (rule instanceof CSSStyleRule && rule.selectorText) {
            return rule.selectorText.includes('.card') || 
                   rule.selectorText.includes('--card') ||
                   rule.selectorText.includes('--background');
          }
          return false;
        });
        
        if (cardRules.length > 0) {
          cardRulesFound += cardRules.length;
          console.log(`Sheet ${sheetIndex}:`, cardRules.map(r => ({
            selector: (r as CSSStyleRule).selectorText,
            href: sheet.href
          })));
        }
      } catch (e) {
        console.log(`❌ Erro ao acessar sheet ${sheetIndex}:`, (e as Error).message);
      }
    });
    
    console.log(`✅ Total de regras CSS para cards encontradas: ${cardRulesFound}`);
    
    // Verificar tema atual
    const isDark = document.documentElement.classList.contains('dark');
    console.log(`🌙 Tema atual: ${isDark ? 'dark' : 'light'}`);
    
    console.log('=== FIM DEBUG ===');
  }, []);

  return null;
};

export default StyleDebug;
