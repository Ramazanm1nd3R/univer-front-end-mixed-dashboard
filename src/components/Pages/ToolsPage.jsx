import React, { useState } from 'react';
import './ToolsPage.css';

function ToolsPage() {
  // Calculator
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  const handleCalculate = () => {
    try {
      const result = eval(calcInput);
      setCalcResult(result);
    } catch (error) {
      setCalcResult('Ошибка');
    }
  };

  // Color Converter
  const [hexColor, setHexColor] = useState('#667eea');
  const [rgbColor, setRgbColor] = useState('rgb(102, 126, 234)');

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : 'Invalid';
  };

  const handleHexChange = (value) => {
    setHexColor(value);
    setRgbColor(hexToRgb(value));
  };

  // Text Counter
  const [text, setText] = useState('');
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;

  // Unit Converter
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('miles');

  const convertUnits = () => {
    const value = parseFloat(inputValue) || 0;
    const conversions = {
      'km-miles': value * 0.621371,
      'miles-km': value * 1.60934,
      'kg-lbs': value * 2.20462,
      'lbs-kg': value * 0.453592,
      'c-f': (value * 9/5) + 32,
      'f-c': (value - 32) * 5/9
    };
    return conversions[`${fromUnit}-${toUnit}`]?.toFixed(2) || value;
  };

  // Password Generator
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="tools-page">
      <div className="page-header">
        <h1>Инструменты</h1>
        <p>Полезные утилиты для повседневных задач</p>
      </div>

      <div className="tools-grid">
        {/* Калькулятор */}
        <div className="tool-card">
          <h3>🧮 Калькулятор</h3>
          <div className="tool-content">
            <input
              type="text"
              placeholder="Введите выражение (например: 2+2*3)"
              value={calcInput}
              onChange={(e) => setCalcInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
            />
            <button onClick={handleCalculate}>Вычислить</button>
            {calcResult && (
              <div className="result">
                <strong>Результат:</strong> {calcResult}
              </div>
            )}
          </div>
        </div>

        {/* Конвертер цветов */}
        <div className="tool-card">
          <h3>🎨 Конвертер цветов</h3>
          <div className="tool-content">
            <div className="color-preview" style={{ backgroundColor: hexColor }}></div>
            <div className="input-group">
              <label>HEX:</label>
              <input
                type="text"
                value={hexColor}
                onChange={(e) => handleHexChange(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>RGB:</label>
              <input type="text" value={rgbColor} readOnly />
              <button onClick={() => copyToClipboard(rgbColor)}>Копировать</button>
            </div>
          </div>
        </div>

        {/* Счетчик текста */}
        <div className="tool-card">
          <h3>📝 Анализатор текста</h3>
          <div className="tool-content">
            <textarea
              placeholder="Введите или вставьте текст..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="5"
            />
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-value">{charCount}</span>
                <span className="stat-label">Символов</span>
              </div>
              <div className="stat">
                <span className="stat-value">{charNoSpaces}</span>
                <span className="stat-label">Без пробелов</span>
              </div>
              <div className="stat">
                <span className="stat-value">{wordCount}</span>
                <span className="stat-label">Слов</span>
              </div>
              <div className="stat">
                <span className="stat-value">{Math.ceil(wordCount / 200)}</span>
                <span className="stat-label">Минут чтения</span>
              </div>
            </div>
          </div>
        </div>

        {/* Конвертер единиц */}
        <div className="tool-card">
          <h3>⚖️ Конвертер единиц</h3>
          <div className="tool-content">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Введите значение"
            />
            <div className="converter-row">
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                <option value="km">Километры</option>
                <option value="miles">Мили</option>
                <option value="kg">Килограммы</option>
                <option value="lbs">Фунты</option>
                <option value="c">Цельсий</option>
                <option value="f">Фаренгейт</option>
              </select>
              <span>→</span>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                <option value="miles">Мили</option>
                <option value="km">Километры</option>
                <option value="lbs">Фунты</option>
                <option value="kg">Килограммы</option>
                <option value="f">Фаренгейт</option>
                <option value="c">Цельсий</option>
              </select>
            </div>
            <div className="result">
              <strong>Результат:</strong> {convertUnits()}
            </div>
          </div>
        </div>

        {/* Генератор паролей */}
        <div className="tool-card">
          <h3>🔐 Генератор паролей</h3>
          <div className="tool-content">
            <div className="input-group">
              <label>Длина: {passwordLength}</label>
              <input
                type="range"
                min="8"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(e.target.value)}
              />
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                />
                Цифры
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                />
                Символы
              </label>
            </div>
            <button onClick={generatePassword}>Сгенерировать</button>
            {password && (
              <div className="password-output">
                <code>{password}</code>
                <button onClick={() => copyToClipboard(password)}>Копировать</button>
              </div>
            )}
          </div>
        </div>

        {/* JSON Formatter */}
        <div className="tool-card full-width">
          <h3>🔧 JSON Форматтер</h3>
          <div className="tool-content">
            <div className="json-formatter">
              <textarea
                placeholder='{"name": "example", "value": 123}'
                onChange={(e) => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(e.target.value), null, 2);
                    e.target.nextSibling.value = formatted;
                  } catch (err) {
                    e.target.nextSibling.value = 'Ошибка: Неверный JSON';
                  }
                }}
                rows="8"
              />
              <textarea
                readOnly
                placeholder="Отформатированный JSON появится здесь..."
                rows="8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsPage;