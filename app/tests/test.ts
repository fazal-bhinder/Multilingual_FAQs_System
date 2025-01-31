import { describe, it, expect, jest } from "@jest/globals"; 
import { translateFAQ } from "../api/faqs/route";


const mockTranslations = {
  hi: {
    question: 'translated question in Hindi',
    answer: 'translated answer in Hindi',
  },
  bn: {
    question: 'translated question in Bengali',
    answer: 'translated answer in Bengali',
  },
};


jest.mock('../api/faqs/route', () => ({
  //@ts-ignore
  ...jest.requireActual('../api/faqs/route'),
  translateText: jest.fn(), 
}));

describe('translateFAQ', () => {

  it('should translate question and answer into Hindi and Bengali', async () => {
    const question = 'What is your name?';
    const answer = 'My name is GPT.';

   
    (translateFAQ as any).translateText
      .mockResolvedValueOnce(mockTranslations.hi.question)
      .mockResolvedValueOnce(mockTranslations.hi.answer)
      .mockResolvedValueOnce(mockTranslations.bn.question)
      .mockResolvedValueOnce(mockTranslations.bn.answer);

    const result = await translateFAQ({ question, answer });

    expect(result.question_hi).toBe(mockTranslations.hi.question);
    expect(result.answer_hi).toBe(mockTranslations.hi.answer);
    expect(result.question_bn).toBe(mockTranslations.bn.question);
    expect(result.answer_bn).toBe(mockTranslations.bn.answer);
  });

  it('should handle errors in translation gracefully', async () => {
    const question = 'What is your name?';
    const answer = 'My name is GPT.';

    (translateFAQ as any).translateText
      .mockResolvedValueOnce(mockTranslations.hi.question)
      .mockResolvedValueOnce(mockTranslations.hi.answer)
      .mockRejectedValueOnce(new Error('Translation failed'));

    const result = await translateFAQ({ question, answer });

    expect(result.question_hi).toBe(mockTranslations.hi.question);
    expect(result.answer_hi).toBe(mockTranslations.hi.answer);
    expect(result.question_bn).toBeUndefined();
    expect(result.answer_bn).toBeUndefined();
  });
});
