import { NextResponse } from 'next/server';
import { prisma } from '../../lib/db';
import { redis } from '../../lib/redis';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function translateText(text: string, targetLang: string) {
    const prompt = `Translate the following text to ${targetLang}: "${text}"`;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text(); 
    } catch (error) {
        throw new Error('Translation failed');
    }
}

export const translateFAQ = async ({ question, answer }: { question: string, answer: string }) => {
    const translations: Record<string, { question: string, answer: string }> = {};
    try {
        translations['hi'] = {
            question: await translateText(question, 'Hindi'),
            answer: await translateText(answer, 'Hindi'),
        };

        translations['bn'] = {
            question: await translateText(question, 'Bengali'),
            answer: await translateText(answer, 'Bengali'),
        };
        
    } catch (error) {
        console.error('Translation Error:', error);
    }

    return translations;
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en';

    const cachedFAQs = await redis.get(`faqs_${lang}`);
    if (cachedFAQs) {
        return NextResponse.json(JSON.parse(cachedFAQs));
    }

    const faqs = await prisma.fAQ.findMany();

    const translatedFAQs = await Promise.all(
        faqs.map(async (faq: any) => {
            if (lang === 'en') return faq;

            const targetLang = lang as string;
            if (faq.translations && faq.translations[targetLang]) {
                return { 
                    ...faq, 
                    question: faq.translations[targetLang].question,
                    answer: faq.translations[targetLang].answer
                };
            }

            const translatedQuestion = await translateText(faq.question, targetLang);
            const translatedAnswer = await translateText(faq.answer, targetLang);

            return { 
                ...faq, 
                question: translatedQuestion,
                answer: translatedAnswer 
            };
        })
    );

    await redis.set(`faqs_${lang}`, JSON.stringify(translatedFAQs), 'EX', 3600);

    return NextResponse.json(translatedFAQs);
}

export async function POST(req: Request) {
    try {
        const { question, answer } = await req.json();
        const { searchParams } = new URL(req.url);
        const lang = searchParams.get('lang') || 'en';

        if (!question || !answer) {
            return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
        }

        const translations = await translateFAQ({ question, answer });

        const newFAQ = await prisma.fAQ.create({
            data: {
                question,
                answer,
                translations,
            }
        });

        await redis.del(`faqs_en`);
        for (const lang of Object.keys(translations)) {
            await redis.del(`faqs_${lang}`);
        }

        if (translations[lang]) {
            return NextResponse.json({
                question: translations[lang].question,
                answer: translations[lang].answer
            });
        }

        return NextResponse.json(newFAQ);
    } catch (error) {
        console.error("Error creating FAQ:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id'); // Assuming `id` is passed as a query param

        if (!id) {
            return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
        }

        // Delete FAQ from database
        const deletedFAQ = await prisma.fAQ.delete({
            where: {
                id: parseInt(id),
            },
        });

        // Clear cache for the deleted FAQ
        await redis.del(`faqs_en`);
        const langs = ['hi', 'bn'];
        for (const lang of langs) {
            await redis.del(`faqs_${lang}`);
        }

        return NextResponse.json({ message: 'FAQ deleted successfully', deletedFAQ });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}