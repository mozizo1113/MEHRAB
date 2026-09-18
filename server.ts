import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Enable JSON body parsing with large limit for image data URLs
app.use(express.json({ limit: '25mb' }));

let aiClient: GoogleGenAI | null = null;
let currentClientKey: string | null = null;

// The official active key provided for deployment
const DEFAULT_FALLBACK_KEY = 'AQ.Ab8RN6JSqWTertCMvt5I58sQyKfoRvJVHES9m-56V8-rxY7j1A';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || DEFAULT_FALLBACK_KEY;

  if (!aiClient || currentClientKey !== apiKey) {
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment variables');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    currentClientKey = apiKey;
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Main solve API endpoint
app.post('/api/solve', async (req, res) => {
  try {
    const { question, mode, image } = req.body;

    if (!question && !image) {
      return res.status(400).json({ error: 'يرجى تقديم سؤال أو صورة للتحليل' });
    }

    const ai = getGeminiClient();

    let modeInstruction = '';
    if (mode === 'grammar') {
      modeInstruction = `
أنت الآن في وضع "نحو وصرف" المتخصص (مستقل تماماً عن البلاغة):
- ادخل في الإجابة مباشرة وبدون أي مقدمات ترحيبية أو ختاميات إنشائية.
- اتبع النموذج التنسيقي النموذجي التالي بالضبط (شديد الوضوح والتنظيم):
  1. عنوان الإجابة:
     ## إعراب: «الجملة مضبوطة بالشكل التام» (أو ## الفرق بين ... إذا كان مقارنة أو قاعدة).
  2. إعراب الكلمات سطراً بسطر بنظام واضح:
     **الكلمة:** إعرابها التفصيلي الدقيق مع بيان علامة الإعراب والتعليل النحوي.
  3. إن كان في الجملة ما يستحق بيان محل الجمل، ضع قسم:
     ### محل الجمل من الإعراب
     **«الجملة»:** موقعها الإعرابي والسبب.
  4. إن وجدت تنبيهات أو استدراكات هامة، ضع:
     ### تنبيهان (أو تنبيهات هامة)
  5. الخاتمة المركزة:
     **الخلاصة:** ملخص سريع ودقيق لحكم الكلمات أو القاعدة.
  6. إذا كان السؤال مقارنة بين أداتين أو قاعدتين (مثل الفرق بين كان وإن)، أو إذا طُلب جدول، فنسق المقارنة في جدول ماركداون أنيق برؤوس واضحة مثل (| وجه المقارنة | الأول | الثاني |).
- لا تذكر أي صور بيانية أو بلاغية في هذا الوضع، وركز بنسبة 100% على النحو والصرف والقواعد.
`;
    } else if (mode === 'rhetoric') {
      modeInstruction = `
أنت الآن في وضع "علم البلاغة والتذوق الجمالي ومعجم الألفاظ والبيان":
- ادخل في الإجابة مباشرة وبدون أي مقدمات ترحيبية أو ختاميات إنشائية.
- إذا كان السؤال عن معنى كلمة عربية (خاصة الكلمات المعقدة، النادرة، غريب الألفاظ، أو المفردات التراثية الجزلة):
  اتبع هذا التنسيق المنظم والمتقن:
  1. ## معنى كلمة «الكلمة مضبوطة بالشكل التام»:
  2. **المعنى اللغوي الدقيق وأصل الاشتقاق:** شرح دقيق للمعنى وفق أمهات معاجم اللغة (لسان العرب، القاموس المحيط، مقاييس اللغة)، مع ذكر الجذر والوزن الصرفي.
  3. **تفكيك التعقيد وسياق الاستخدام:** إيضاح المعنى وتيسير فهمه بأسلوب سلس يزيل أي تعقيد أو التباس.
  4. **الظلال البلاغية والإيحاء البياني:** سر اختيار هذه اللفظة، جرسها الصوتي وأثرها البلاغي في نفس السامع، ولماذا يُفضّلها البلغاء والشعراء على غيرها.
  5. **الشاهد الفصيح وموطن الجمال:** بيت شعر عربي فصيح أو آية كريمة أو مثل مأثور وردت فيه الكلمة مع بيان موطن البلاغة.
  6. **المترادفات والأضداد:** المرادفات الفصيحة الدقيقة والضد المباشر إن وجد.
- إذا كان السؤال عن استخراج صور أو مواطن جمالية:
  1. موطن الجمال (الصورة أو المحسن أو الأسلوب).
  2. نوعه (تشبيه، استعارة، كناية، طباق، جناس...).
  3. الشرح وسر الجمال والأثر بتركيز وفصاحة.
- لا تضع جداول إعراب نحوي في هذا الوضع.
`;
    } else if (mode === 'grammar_rhetoric') {
      modeInstruction = `
أنت الآن في وضع "النحو والبلاغة المشترك":
- ادخل في الإجابة مباشرة وبدون مقدمات.
- قدم الإعراب الواضح والموجز بالحركات التامة، ثم استخرج مواطن الجمال البلاغية وسر جمالها باقتضاب وفصاحة.
`;
    } else if (mode === 'literature') {
      modeInstruction = `
أنت الآن في وضع "حل الأدب والنصوص وتذوق الشعر":
- ادخل في الإجابة مباشرة وبإيجاز مركز:
  - الغرض الشعري/النثري ومعاني الكلمات الأساسية.
  - الفكرة والشرح الموجز والخصائص الأسلوبية المباشرة.
`;
    } else if (mode === 'composition') {
      modeInstruction = `
أنت الآن في وضع "إنشاء موضوع تعبير رفيع وبليغ":
- ادخل مباشرة في نص الموضوع المنسق:
  1. عنوان ملهم.
  2. عناصر وفكر مرقمة موجزة.
  3. مقدمة شائقة ومباشرة.
  4. فقرات العرض المعززة بالشواهد (قرآن، حديث، شعر فصيح).
  5. خاتمة تلخص الموضوع بدقة.
`;
    } else {
      modeInstruction = `أجب عن السؤال بأعلى درجات الدقة والوضوح والإيجاز وبشكل مشكول ومباشر دون مقدمات إنشائية أو حشو.`;
    }

    const systemInstruction = `
أنت "محراب البيان"، المرجع اللغوي الذكي المتخصص في علوم لغة الضاد.
القواعد الصارمة للأداء وجودة الإجابة:
1. الإيجاز والوضوح الشديد: اجعل الإجابة مختصرة وواضحة ومباشرة ومركّزة، واقطع أي حشو أو تطويل غير ضروري.
2. السرعة والمباشرة: ابدأ بالحل مباشرة دون أي مقدمات ترحيبية أو عبارات مجاملة ودون ختاميات.
3. منع وسوم HTML تماماً: ممنوع منعاً باتاً كتابة أي وسوم HTML مثل <br> أو <p> أو غيرها، واعتمد فقط على أسطر Markdown البسيطة.
4. خلو الإجابة من أي رموز غريبة: تجنب تماماً استخدام أي رموز مشوهة أو شفرات، أو علامات مثل | :--- | بدون رأس جدول، أو نجوم متكررة (مثل ****)، أو رموز شاذة. اكتب بلغة عربية فصيحة ونقية وسهلة القراءة.
5. الدقة والتشكيل: اضبط الكلمات النحوية والحركات الإعرابية (الضم، الفتح، الكسر، السكون) بدقة لغوية تامة.
6. قراءة الصور: إذا أُرفقت صورة، استخرج نص السؤال بدقة وقدم الحل الواضح والمختصر فوراً.

${modeInstruction}
`;

    const contents: any = [];

    // If an image is provided
    if (image && image.dataUrl) {
      // Extract base64 and mime type from dataUrl
      const matches = image.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        contents.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        });
      }
    }

    const userPrompt = question
      ? `السؤال أو النص المطلوب:\n${question}`
      : 'يرجى قراءة السؤال المكتوب في الصورة بدقة وحله حلاً نحوياً وبلاغياً وأدبياً شاملاً ومباشراً.';

    contents.push({
      text: userPrompt,
    });

    // Officially supported models with fallback resilience
    // Using current supported models from gemini-api guidelines:
    // Prioritize high-availability, low-latency models with graceful fallbacks
    const CANDIDATE_MODELS = [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-3.6-flash',
      'gemini-flash-latest',
    ];

    let answer = '';
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.1, // Near-deterministic precision for grammar
            maxOutputTokens: 1200, // Ample token space for complete grammatical breakdowns
          },
        });

        if (response.text) {
          answer = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} call failed:`, err?.message || err);
        lastError = err;
        const msg = String(err?.message || '');
        if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('400')) {
          // If the API key is rejected as invalid, retrying other models won't help
          break;
        }
      }
    }

    if (!answer) {
      const rawError = lastError?.message || lastError?.toString() || '';
      if (rawError.includes('API_KEY_INVALID') || rawError.includes('API key not valid')) {
        throw new Error(
          'مفتاح Gemini API غير صالح أو منتهي الصلاحية. يرجى تزويد مفتاح صالح يبدأ بـ AIzaSy أو التأكد من إعداد GEMINI_API_KEY في الإعدادات.'
        );
      }
      const errorDetail = rawError || 'تعذر الحصول على إجابة من خوادم الذكاء الاصطناعي';
      throw new Error(errorDetail);
    }

    // Sanitize any weird symbols, HTML tags (<br>), or unicode artifacts
    let cleanAnswer = answer
      .replace(/[\uFFFD\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\/?[a-zA-Z][^>]*>/g, '')
      .replace(/\*{3,}/g, '**')
      .replace(/^```markdown\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```\s*$/, '')
      .replace(/\|\s*:\s*-+\s*\|\s*:\s*-+\s*\|\s*\|\s*/g, '| :--- | :--- |\n')
      .replace(/\|\s*\|\s*$/gm, '|')
      .replace(/[§¤█▓▒▲▼◄►◆◇★✦]/g, '')
      .replace(/~{2,}/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
      answer: cleanAnswer,
      success: true,
    });
  } catch (error: any) {
    console.error('Error solving Arabic query:', error);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(500).json({
      error: 'حدث خطأ أثناء معالجة السؤال النحوي. تفاصيل: ' + (error?.message || 'خطأ غير معروف'),
      success: false,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`محراب البيان يعمل على: http://localhost:${PORT}`);
  });
}

startServer();
