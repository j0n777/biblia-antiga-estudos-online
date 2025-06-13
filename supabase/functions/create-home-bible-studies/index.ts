
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const bibleStudies = [
      {
        title_key: 'por_onde_comecar_ler_biblia',
        title: {
          pt: 'Por onde começar a ler a Bíblia?',
          en: 'Where to start reading the Bible?'
        },
        content: {
          pt: `# Por onde começar a ler a Bíblia?

## Um guia para iniciantes na leitura bíblica

A Bíblia pode parecer intimidante para quem está começando. Com 66 livros, diferentes estilos literários e contextos históricos, é normal se sentir perdido. Este guia vai ajudá-lo a dar os primeiros passos.

### 1. Comece pelos Evangelhos

Os Evangelhos (Mateus, Marcos, Lucas e João) são o melhor lugar para começar. Eles contam a história de Jesus Cristo e são fundamentais para entender toda a mensagem bíblica.

**Sugestão:** Comece pelo Evangelho de João, que é mais direto e focado na divindade de Cristo.

### 2. Leia o livro de Salmos

Os Salmos são orações e cânticos que expressam toda a gama de emoções humanas. Eles ajudam na vida devocional e são facilmente aplicáveis ao dia a dia.

### 3. Explore as cartas do Novo Testamento

Após os Evangelhos, leia as cartas de Paulo, especialmente Romanos e Efésios, que explicam doutrinas fundamentais da fé cristã.

### 4. Volte ao Antigo Testamento

Comece com Gênesis (criação e patriarcas), Êxodo (libertação do Egito) e os livros históricos como 1 e 2 Samuel.

### Dicas importantes:

- **Ore antes de ler:** Peça a Deus entendimento
- **Use uma tradução moderna:** King James Atualizada ou Nova Versão Internacional
- **Mantenha consistência:** É melhor ler pouco todos os dias do que muito esporadicamente
- **Faça anotações:** Escreva perguntas e reflexões
- **Busque ajuda:** Participe de grupos de estudo ou use comentários bíblicos

### Versículos para memorizar:

- João 3:16 - O amor de Deus
- Romanos 3:23 - A condição humana
- Romanos 6:23 - O presente de Deus
- Efésios 2:8-9 - Salvação pela graça

Lembre-se: a leitura da Bíblia é uma jornada, não uma corrida. Permita que o Espírito Santo guie seu entendimento e transforme sua vida através da Palavra de Deus.`,
          en: `# Where to start reading the Bible?

## A guide for beginners in Bible reading

The Bible can seem intimidating for beginners. With 66 books, different literary styles and historical contexts, it's normal to feel lost. This guide will help you take the first steps.

### 1. Start with the Gospels

The Gospels (Matthew, Mark, Luke and John) are the best place to start. They tell the story of Jesus Christ and are fundamental to understanding the entire biblical message.

**Suggestion:** Start with the Gospel of John, which is more direct and focused on the divinity of Christ.

### 2. Read the book of Psalms

The Psalms are prayers and songs that express the full range of human emotions. They help in devotional life and are easily applicable to daily life.

### 3. Explore the New Testament letters

After the Gospels, read Paul's letters, especially Romans and Ephesians, which explain fundamental doctrines of the Christian faith.

### 4. Return to the Old Testament

Start with Genesis (creation and patriarchs), Exodus (liberation from Egypt) and historical books like 1 and 2 Samuel.

### Important tips:

- **Pray before reading:** Ask God for understanding
- **Use a modern translation:** Use a contemporary version
- **Maintain consistency:** It's better to read a little every day than a lot sporadically
- **Take notes:** Write down questions and reflections
- **Seek help:** Join study groups or use Bible commentaries

### Verses to memorize:

- John 3:16 - God's love
- Romans 3:23 - The human condition
- Romans 6:23 - God's gift
- Ephesians 2:8-9 - Salvation by grace

Remember: reading the Bible is a journey, not a race. Allow the Holy Spirit to guide your understanding and transform your life through God's Word.`
        },
        category: 'beginner',
        icon: '📖',
        points: 10
      },
      {
        title_key: 'os_10_mandamentos',
        title: {
          pt: 'Os 10 Mandamentos',
          en: 'The 10 Commandments'
        },
        content: {
          pt: `# Os 10 Mandamentos

## Estudo sobre os mandamentos e sua aplicação hoje

Os Dez Mandamentos, dados por Deus a Moisés no Monte Sinai, são princípios fundamentais que orientam a vida moral e espiritual. Embora tenham sido dados há milhares de anos, permanecem relevantes hoje.

### Os Mandamentos (Êxodo 20:1-17)

#### Mandamentos sobre o relacionamento com Deus (1-4):

**1. Não terás outros deuses diante de mim**
- Deus deve ser o primeiro em nossas vidas
- Aplicação hoje: Não idolatrar dinheiro, fama, trabalho ou qualquer coisa

**2. Não farás imagens de escultura**
- Não adorar ídolos ou imagens
- Aplicação hoje: Não transformar nada em objeto de adoração

**3. Não tomarás o nome do Senhor teu Deus em vão**
- Respeitar o nome de Deus
- Aplicação hoje: Não usar o nome de Deus como palavrão ou de forma desrespeitosa

**4. Lembra-te do dia do sábado, para o santificar**
- Separar um dia para descanso e adoração
- Aplicação hoje: Ter um dia de descanso e dedicação a Deus

#### Mandamentos sobre relacionamentos humanos (5-10):

**5. Honra a teu pai e a tua mãe**
- Respeitar e cuidar dos pais
- Aplicação hoje: Valorizar a família e cuidar dos idosos

**6. Não matarás**
- Preservar a vida humana
- Aplicação hoje: Não matar, não odiar, não destruir a reputação de alguém

**7. Não adulterarás**
- Fidelidade no casamento
- Aplicação hoje: Manter pureza sexual e fidelidade conjugal

**8. Não furtarás**
- Respeitar a propriedade alheia
- Aplicação hoje: Não roubar, não sonegar impostos, ser honesto nos negócios

**9. Não dirás falso testemunho**
- Falar a verdade
- Aplicação hoje: Não mentir, não fofar, não difamar

**10. Não cobiçarás**
- Contentamento com o que se tem
- Aplicação hoje: Não invejar, ser grato, praticar generosidade

### Jesus e os Mandamentos

Jesus resumiu os mandamentos em dois grandes princípios (Mateus 22:37-39):
1. Amar a Deus sobre todas as coisas
2. Amar o próximo como a si mesmo

### Aplicação Prática

Os mandamentos não são apenas regras, mas expressão do caráter de Deus e diretrizes para uma vida plena. Eles nos mostram:

- Como viver em relacionamento correto com Deus
- Como tratar as pessoas com dignidade e respeito
- Como construir uma sociedade justa e amorosa

### Reflexão

"Se me amais, guardai os meus mandamentos." - João 14:15

Os mandamentos não são um fardo, mas uma expressão do amor de Deus por nós. Eles nos protegem e nos guiam para uma vida abundante.`,
          en: `# The 10 Commandments

## Study on the commandments and their application today

The Ten Commandments, given by God to Moses on Mount Sinai, are fundamental principles that guide moral and spiritual life. Although given thousands of years ago, they remain relevant today.

### The Commandments (Exodus 20:1-17)

#### Commandments about relationship with God (1-4):

**1. You shall have no other gods before me**
- God should be first in our lives
- Today's application: Don't idolize money, fame, work or anything

**2. You shall not make idols**
- Don't worship idols or images
- Today's application: Don't turn anything into an object of worship

**3. You shall not take the name of the Lord your God in vain**
- Respect God's name
- Today's application: Don't use God's name as profanity or disrespectfully

**4. Remember the Sabbath day, to keep it holy**
- Set aside a day for rest and worship
- Today's application: Have a day of rest and dedication to God

#### Commandments about human relationships (5-10):

**5. Honor your father and mother**
- Respect and care for parents
- Today's application: Value family and care for the elderly

**6. You shall not murder**
- Preserve human life
- Today's application: Don't kill, don't hate, don't destroy someone's reputation

**7. You shall not commit adultery**
- Faithfulness in marriage
- Today's application: Maintain sexual purity and marital fidelity

**8. You shall not steal**
- Respect others' property
- Today's application: Don't steal, don't evade taxes, be honest in business

**9. You shall not bear false witness**
- Speak the truth
- Today's application: Don't lie, don't gossip, don't defame

**10. You shall not covet**
- Contentment with what you have
- Today's application: Don't envy, be grateful, practice generosity

### Jesus and the Commandments

Jesus summarized the commandments into two great principles (Matthew 22:37-39):
1. Love God above all things
2. Love your neighbor as yourself

### Practical Application

The commandments are not just rules, but expressions of God's character and guidelines for a full life. They show us:

- How to live in right relationship with God
- How to treat people with dignity and respect
- How to build a just and loving society

### Reflection

"If you love me, keep my commandments." - John 14:15

The commandments are not a burden, but an expression of God's love for us. They protect us and guide us to an abundant life.`
        },
        category: 'doctrine',
        icon: '📜',
        points: 15
      },
      {
        title_key: 'vida_de_jesus',
        title: {
          pt: 'Vida de Jesus',
          en: 'Life of Jesus'
        },
        content: {
          pt: `# Vida de Jesus

## Jornada pelos evangelhos e a vida de Cristo

A vida de Jesus Cristo é o centro da fé cristã. Através dos quatro evangelhos, podemos acompanhar sua jornada terrena e compreender sua missão divina.

### Nascimento e Infância

**Nascimento Virginal** (Mateus 1-2, Lucas 1-2)
- Anunciação do anjo Gabriel a Maria
- Nascimento em Belém durante censo romano
- Visita dos pastores e dos magos do Oriente
- Fuga para o Egito devido à perseguição de Herodes

**Infância e Juventude**
- Crescimento em Nazaré
- Único relato da infância: Jesus no templo aos 12 anos (Lucas 2:41-52)
- "E Jesus crescia em sabedoria, e em estatura, e em graça para com Deus e os homens"

### Início do Ministério

**Batismo** (Mateus 3, Marcos 1, Lucas 3)
- Batizado por João Batista no rio Jordão
- Voz do Pai: "Este é o meu Filho amado"
- Descida do Espírito Santo como pomba

**Tentação no Deserto** (Mateus 4, Lucas 4)
- 40 dias de jejum e oração
- Três tentações de Satanás
- Vitória através das Escrituras

### Ministério Público (3 anos aproximadamente)

**Ensinos Principais:**
- Sermão do Monte (Mateus 5-7)
- Parábolas do Reino dos Céus
- Ensinos sobre amor, perdão e vida eterna
- O Grande Mandamento: amar a Deus e ao próximo

**Milagres Marcantes:**
- Transformação da água em vinho (primeiro milagre)
- Multiplicação dos pães e peixes
- Cura de cegos, paralíticos e leprosos
- Ressurreição de Lázaro
- Andar sobre as águas

**Discípulos:**
- Chamado dos 12 apóstolos
- Treinamento e envio em missão
- Pedro, João, Tiago (círculo íntimo)

### Semana da Paixão

**Entrada Triunfal** (Domingo de Ramos)
- Entrada em Jerusalém montado em jumentinho
- Multidões gritando "Hosana ao Filho de Davi"

**Última Semana:**
- Purificação do templo
- Ensinos finais aos discípulos
- Última Ceia (instituição da comunhão)
- Oração no Getsêmani
- Prisão e julgamentos

### Crucificação e Morte

**Sexta-feira da Paixão:**
- Julgamento diante de Pilatos
- Flagelação e coroação de espinhos
- Via crucis - caminho para o Calvário
- Crucificação entre dois ladrões
- Últimas sete palavras na cruz
- Morte às 15h (hora nona)

**Significado Teológico:**
- Sacrifício pelos pecados da humanidade
- Cumprimento das profecias messiânicas
- Reconciliação entre Deus e os homens

### Ressurreição

**Domingo da Ressurreição:**
- Túmulo vazio descoberto pelas mulheres
- Aparições aos discípulos
- Prova da vitória sobre a morte
- Fundamento da fé cristã

**Aparições Pós-Ressurreição:**
- Às mulheres no jardim
- Aos discípulos de Emaús
- Aos apóstolos (com e sem Tomé)
- A mais de 500 pessoas (1 Coríntios 15:6)

### Ascensão

**40 dias depois da ressurreição:**
- Últimas instruções aos discípulos
- Grande Comissão (Mateus 28:18-20)
- Ascensão ao céu
- Promessa da segunda vinda

### Impacto e Significado

A vida de Jesus transformou a história humana:
- Exemplo perfeito de amor e compaixão
- Ensinos que revolucionaram a moral
- Esperança de vida eterna
- Fundamento da Igreja cristã

### Reflexão

"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." - João 3:16

A vida de Jesus é a maior demonstração do amor de Deus pela humanidade. Sua jornada terrena nos mostra o caminho para uma vida plena e a esperança da eternidade com Deus.`,
          en: `# Life of Jesus

## Journey through the gospels and the life of Christ

The life of Jesus Christ is the center of the Christian faith. Through the four gospels, we can follow his earthly journey and understand his divine mission.

### Birth and Childhood

**Virgin Birth** (Matthew 1-2, Luke 1-2)
- Annunciation by angel Gabriel to Mary
- Birth in Bethlehem during Roman census
- Visit from shepherds and wise men from the East
- Flight to Egypt due to Herod's persecution

**Childhood and Youth**
- Growth in Nazareth
- Only childhood account: Jesus in the temple at 12 years old (Luke 2:41-52)
- "And Jesus grew in wisdom and stature, and in favor with God and man"

### Beginning of Ministry

**Baptism** (Matthew 3, Mark 1, Luke 3)
- Baptized by John the Baptist in the Jordan River
- Voice of the Father: "This is my beloved Son"
- Descent of the Holy Spirit as a dove

**Temptation in the Wilderness** (Matthew 4, Luke 4)
- 40 days of fasting and prayer
- Three temptations from Satan
- Victory through Scripture

### Public Ministry (approximately 3 years)

**Main Teachings:**
- Sermon on the Mount (Matthew 5-7)
- Parables of the Kingdom of Heaven
- Teachings on love, forgiveness and eternal life
- The Great Commandment: love God and neighbor

**Notable Miracles:**
- Turning water into wine (first miracle)
- Multiplication of loaves and fishes
- Healing the blind, paralyzed and lepers
- Resurrection of Lazarus
- Walking on water

**Disciples:**
- Calling of the 12 apostles
- Training and sending on mission
- Peter, John, James (inner circle)

### Passion Week

**Triumphal Entry** (Palm Sunday)
- Entry into Jerusalem riding on a donkey
- Crowds shouting "Hosanna to the Son of David"

**Final Week:**
- Cleansing of the temple
- Final teachings to disciples
- Last Supper (institution of communion)
- Prayer in Gethsemane
- Arrest and trials

### Crucifixion and Death

**Good Friday:**
- Trial before Pilate
- Scourging and crown of thorns
- Via crucis - path to Calvary
- Crucifixion between two thieves
- Last seven words on the cross
- Death at 3 PM (ninth hour)

**Theological Significance:**
- Sacrifice for the sins of humanity
- Fulfillment of messianic prophecies
- Reconciliation between God and men

### Resurrection

**Easter Sunday:**
- Empty tomb discovered by women
- Appearances to disciples
- Proof of victory over death
- Foundation of Christian faith

**Post-Resurrection Appearances:**
- To women in the garden
- To disciples on Emmaus road
- To apostles (with and without Thomas)
- To more than 500 people (1 Corinthians 15:6)

### Ascension

**40 days after resurrection:**
- Final instructions to disciples
- Great Commission (Matthew 28:18-20)
- Ascension to heaven
- Promise of second coming

### Impact and Significance

The life of Jesus transformed human history:
- Perfect example of love and compassion
- Teachings that revolutionized morality
- Hope of eternal life
- Foundation of the Christian Church

### Reflection

"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." - John 3:16

The life of Jesus is the greatest demonstration of God's love for humanity. His earthly journey shows us the path to a full life and the hope of eternity with God.`
        },
        category: 'biography',
        icon: '✝️',
        points: 20
      },
      {
        title_key: 'salmos_de_adoracao',
        title: {
          pt: 'Salmos de Adoração',
          en: 'Psalms of Worship'
        },
        content: {
          pt: `# Salmos de Adoração

## Meditações nos Salmos de louvor

Os Salmos são o livro de louvor e adoração por excelência na Bíblia. Através deles, aprendemos como expressar nossa devoção a Deus em todas as circunstâncias da vida.

### O que são os Salmos?

Os Salmos são:
- Cânticos e orações do povo de Israel
- Expressões autênticas da alma humana
- Modelo para nossa vida devocional
- Ponte entre o coração humano e o divino

### Principais Salmos de Adoração

#### Salmo 23 - O Senhor é meu Pastor
*"O Senhor é o meu pastor; nada me faltará"*

**Temas principais:**
- Cuidado e proteção de Deus
- Provisão divina
- Paz em meio às adversidades
- Esperança na eternidade

**Aplicação:** Confiar na provisão e cuidado de Deus em todas as circunstâncias.

#### Salmo 100 - Convite à Adoração
*"Celebrai com júbilo ao Senhor, todas as terras"*

**Temas principais:**
- Alegria na adoração
- Gratidão a Deus
- Reconhecimento de que somos povo de Deus
- Bondade e misericórdia eternas

**Aplicação:** Adorar a Deus com alegria e gratidão.

#### Salmo 103 - Louvores pelas Bênçãos
*"Bendize, ó minha alma, ao Senhor"*

**Temas principais:**
- Perdão dos pecados
- Cura e restauração
- Compaixão paternal de Deus
- Misericórdia que não falha

**Aplicação:** Lembrar-se das bênçãos de Deus e louvá-lo por elas.

#### Salmo 139 - Conhecimento Divino
*"Senhor, tu me sondaste e me conheces"*

**Temas principais:**
- Onisciência de Deus
- Presença constante do Criador
- Formação maravilhosa do ser humano
- Pensamentos preciosos de Deus

**Aplicação:** Maravilhar-se com o conhecimento que Deus tem de nós.

#### Salmo 150 - Grande Final de Louvor
*"Louvai ao Senhor. Louvai a Deus no seu santuário"*

**Temas principais:**
- Chamado universal ao louvor
- Uso de instrumentos na adoração
- Louvor por quem Deus é
- Louvor por suas obras poderosas

**Aplicação:** Expressar louvor com todo nosso ser e capacidades.

### Como Usar os Salmos na Adoração

#### 1. Leitura Meditativa
- Leia lentamente, versículo por versículo
- Reflita no significado de cada palavra
- Permita que o Espírito Santo fale ao seu coração

#### 2. Oração Pessoal
- Use as palavras dos salmos como suas próprias orações
- Adapte as situações dos salmistas à sua realidade
- Expresse seus sentimentos através dos salmos

#### 3. Memorização
- Decore versículos que mais tocam seu coração
- Recite salmos em momentos de necessidade
- Use os salmos como fonte de força e encorajamento

#### 4. Adoração Congregacional
- Leia salmos em voz alta durante cultos
- Cante salmos musicados
- Use salmos como base para liturgias

### Salmos para Diferentes Momentos

**Momentos de Alegria:**
- Salmo 100 - Celebração
- Salmo 150 - Louvor exuberante
- Salmo 66 - Júbilo e gratidão

**Momentos de Tristeza:**
- Salmo 23 - Consolo
- Salmo 42 - Sede de Deus
- Salmo 34 - Livramento

**Momentos de Dificuldade:**
- Salmo 91 - Proteção
- Salmo 27 - Confiança
- Salmo 46 - Refúgio e fortaleza

**Momentos de Gratidão:**
- Salmo 103 - Bênçãos
- Salmo 136 - Misericórdia eterna
- Salmo 107 - Bondade de Deus

### A Estrutura dos Salmos

Muitos salmos seguem um padrão:
1. **Invocação** - Chamado a Deus
2. **Lamento ou Louvor** - Expressão do coração
3. **Petição** - Pedidos específicos
4. **Confiança** - Declaração de fé
5. **Louvor** - Gratidão e adoração

### Jesus e os Salmos

Jesus frequentemente citou os Salmos:
- Durante tentações (Salmo 91)
- Em seus ensinos (Salmo 110)
- Na cruz (Salmo 22)
- Sua ressurreição foi profetizada nos Salmos (Salmo 16)

### Reflexão Final

Os Salmos nos ensinam que a adoração genuína:
- Vem do coração
- É honesta sobre nossas emoções
- Reconhece quem Deus é
- Expressa gratidão pelas bênçãos
- Busca a presença divina

*"Como suspira a corça pelas correntes das águas, assim suspira a minha alma por ti, ó Deus!"* - Salmo 42:1

Que os Salmos sejam nossa escola de adoração, ensinando-nos a amar e louvar a Deus com todo nosso ser.`,
          en: `# Psalms of Worship

## Meditations on the Psalms of praise

The Psalms are the book of praise and worship par excellence in the Bible. Through them, we learn how to express our devotion to God in all circumstances of life.

### What are the Psalms?

The Psalms are:
- Songs and prayers of the people of Israel
- Authentic expressions of the human soul
- Model for our devotional life
- Bridge between the human heart and the divine

### Main Psalms of Worship

#### Psalm 23 - The Lord is my Shepherd
*"The Lord is my shepherd; I shall not want"*

**Main themes:**
- God's care and protection
- Divine provision
- Peace amid adversity
- Hope in eternity

**Application:** Trust in God's provision and care in all circumstances.

#### Psalm 100 - Invitation to Worship
*"Make a joyful noise to the Lord, all the earth"*

**Main themes:**
- Joy in worship
- Gratitude to God
- Recognition that we are God's people
- Eternal goodness and mercy

**Application:** Worship God with joy and gratitude.

#### Psalm 103 - Praise for Blessings
*"Bless the Lord, O my soul"*

**Main themes:**
- Forgiveness of sins
- Healing and restoration
- God's paternal compassion
- Unfailing mercy

**Application:** Remember God's blessings and praise him for them.

#### Psalm 139 - Divine Knowledge
*"O Lord, you have searched me and known me"*

**Main themes:**
- God's omniscience
- Constant presence of the Creator
- Wonderful formation of human beings
- God's precious thoughts

**Application:** Marvel at the knowledge God has of us.

#### Psalm 150 - Grand Finale of Praise
*"Praise the Lord. Praise God in his sanctuary"*

**Main themes:**
- Universal call to praise
- Use of instruments in worship
- Praise for who God is
- Praise for his mighty works

**Application:** Express praise with our whole being and abilities.

### How to Use the Psalms in Worship

#### 1. Meditative Reading
- Read slowly, verse by verse
- Reflect on the meaning of each word
- Allow the Holy Spirit to speak to your heart

#### 2. Personal Prayer
- Use the words of the psalms as your own prayers
- Adapt the situations of the psalmists to your reality
- Express your feelings through the psalms

#### 3. Memorization
- Memorize verses that most touch your heart
- Recite psalms in times of need
- Use psalms as a source of strength and encouragement

#### 4. Congregational Worship
- Read psalms aloud during services
- Sing musical psalms
- Use psalms as the basis for liturgies

### Psalms for Different Moments

**Moments of Joy:**
- Psalm 100 - Celebration
- Psalm 150 - Exuberant praise
- Psalm 66 - Jubilation and gratitude

**Moments of Sadness:**
- Psalm 23 - Comfort
- Psalm 42 - Thirst for God
- Psalm 34 - Deliverance

**Moments of Difficulty:**
- Psalm 91 - Protection
- Psalm 27 - Trust
- Psalm 46 - Refuge and strength

**Moments of Gratitude:**
- Psalm 103 - Blessings
- Psalm 136 - Eternal mercy
- Psalm 107 - God's goodness

### The Structure of the Psalms

Many psalms follow a pattern:
1. **Invocation** - Call to God
2. **Lament or Praise** - Expression of the heart
3. **Petition** - Specific requests
4. **Trust** - Declaration of faith
5. **Praise** - Gratitude and worship

### Jesus and the Psalms

Jesus frequently quoted the Psalms:
- During temptations (Psalm 91)
- In his teachings (Psalm 110)
- On the cross (Psalm 22)
- His resurrection was prophesied in the Psalms (Psalm 16)

### Final Reflection

The Psalms teach us that genuine worship:
- Comes from the heart
- Is honest about our emotions
- Recognizes who God is
- Expresses gratitude for blessings
- Seeks the divine presence

*"As the deer pants for streams of water, so my soul pants for you, my God!"* - Psalm 42:1

May the Psalms be our school of worship, teaching us to love and praise God with our whole being.`
        },
        category: 'devotional',
        icon: '🙏',
        points: 15
      }
    ];

    // Insert bible studies
    const { data, error } = await supabaseClient
      .from('bible_studies')
      .insert(bibleStudies)
      .select();

    if (error) {
      console.error('Error inserting bible studies:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Bible studies created successfully',
      studies: data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
