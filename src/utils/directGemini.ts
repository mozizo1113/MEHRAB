import { AppMode, AttachedImage } from '../types';
import { cleanArabicAnswer } from './textCleaner';

// Built-in fallback API key provided for deployment
const CLIENT_DEFAULT_KEY = 'AQ.Ab8RN6KNQkV8XuEotT6WV1LPrn4ugTBptPMOecc_gI9JgvfL1w';

export async function solveQuestionDirectly(
  question: string,
  mode: AppMode,
  image?: AttachedImage | null,
  signal?: AbortSignal
): Promise<string> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string)?.trim() || CLIENT_DEFAULT_KEY;

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
- إذا كان السؤال عن معنى كلمة عربية:
  1. ## معنى كلمة «الكلمة مضبوطة بالشكل التام»:
  2. **المعنى اللغوي الدقيق وأصل الاشتقاق:** شرح دقيق وفق المعاجم المعتمدة مع الجذر.
  3. **تفكيك التعقيد وسياق الاستخدام:** إيضاح المعنى بأسلوب سلس.
  4. **الظلال البلاغية والإيحاء البياني:** سر اللفظة وأثرها البلاغي.
  5. **الشاهد الفصيح وموطن الجمال:** بيت شعر أو آية كريمة أو مثل مأثور.
  6. **المترادفات والأضداد.**
- إذا كان السؤال عن استخراج صور أو مواطن جمالية:
  1. موطن الجمال. 2. نوعه. 3. الشرح وسر الجمال.
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
  4. فقرات العرض المعززة بالشواهد.
  5. خاتمة تلخص الموضوع بدقة.
`;
  } else {
    modeInstruction = `أجب عن السؤال بأعلى درجات الدقة والوضوح والإيجاز وبشكل مشكول ومباشر دون مقدمات إنشائية أو حشو.`;
  }

  const systemInstruction = `
أنت "محراب البيان"، المرجع اللغوي الذكي المتخصص في علوم لغة الضاد.
القواعد الصارمة للأداء وجودة الإجابة:
1. الإيجاز والوضوح الشديد: اجعل الإجابة مختصرة وواضحة ومباشرة ومركّزة.
2. السرعة والمباشرة: ابدأ بالحل مباشرة دون أي مقدمات ترحيبية أو ختاميات.
3. منع وسوم HTML تماماً: ممنوع كتابة وسوم HTML مثل <br> أو غيرها، واعتمد فقط على Markdown.
4. خلو الإجابة من أي رموز غريبة أو مشوهة.
5. الدقة والتشكيل التام للحركات الإعرابية.
6. قراءة الصور: إذا أُرفقت صورة، استخرج نص السؤال بدقة وقدم الحل فوراً.

${modeInstruction}
`;

  const parts: any[] = [];

  if (image && image.dataUrl) {
    const matches = image.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      parts.push({
        inline_data: {
          mime_type: matches[1],
          data: matches[2],
        },
      });
    }
  }

  const userPrompt = question
    ? `السؤال أو النص المطلوب:\n${question}`
    : 'يرجى قراءة السؤال المكتوب في الصورة بدقة وحله حلاً نحوياً وبلاغياً وأدبياً شاملاً ومباشراً.';

  parts.push({ text: userPrompt });

  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.6-flash',
    'gemini-flash-latest',
  ];

  let rawAnswer = '';
  let lastErrorMsg = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: parts,
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1200,
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        lastErrorMsg = resData?.error?.message || `HTTP ${res.status}`;
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          throw new Error(lastErrorMsg);
        }
        continue;
      }

      const generatedText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        rawAnswer = generatedText;
        break;
      }
    } catch (e: any) {
      lastErrorMsg = e?.message || String(e);
      if (e?.name === 'AbortError') throw e;
    }
  }

  if (!rawAnswer) {
    throw new Error(lastErrorMsg || 'تعذر الحصول على إجابة من خوادم الذكاء الاصطناعي');
  }

  return cleanArabicAnswer(rawAnswer);
}
