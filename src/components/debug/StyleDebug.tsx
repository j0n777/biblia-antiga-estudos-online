
import { useEffect } from 'react';

const StyleDebug = () => {
  useEffect(() => {
    // Debug para verificar estilos aplicados
    const cards = document.querySelectorAll('.card');
    console.log('=== STYLE DEBUG ===');
    console.log('Cards encontrados:', cards.length);
    
    cards.forEach((card, index) => {
      const styles = window.getComputedStyle(card);
      console.log(`Card ${index}:`, {
        backgroundColor: styles.backgroundColor,
        border: styles.border,
        borderRadius: styles.borderRadius,
        classes: card.className
      });
    });

    // Verificar se os estilos CSS estão carregados
    const sheets = Array.from(document.styleSheets);
    console.log('StyleSheets carregadas:', sheets.length);
    
    // Tentar encontrar regras CSS específicas
    sheets.forEach((sheet, sheetIndex) => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        const cardRules = rules.filter(rule => {
          // Verificar se a regra é do tipo CSSStyleRule antes de acessar selectorText
          if (rule instanceof CSSStyleRule && rule.selectorText) {
            return rule.selectorText.includes('.card');
          }
          return false;
        });
        if (cardRules.length > 0) {
          console.log(`Sheet ${sheetIndex} - Regras .card:`, cardRules.map(r => (r as CSSStyleRule).selectorText));
        }
      } catch (e) {
        console.log(`Não foi possível acessar regras da sheet ${sheetIndex}:`, (e as Error).message);
      }
    });
  }, []);

  return null;
};

export default StyleDebug;
