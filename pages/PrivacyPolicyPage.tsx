import React from 'react';
import PageTransition from '../components/PageTransition';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto bg-brand-gray p-4 sm:p-6 md:p-8 rounded-lg border border-brand-light-gray/30">
        <header className="mb-6 border-b-2 border-brand-red/50 pb-4">
          <!-- Google tag (gtag.js) -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-1NM1Y28PL0"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-1NM1Y28PL0');
          </script>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-extrabold text-white">Política de Privacidade</h1>
          <p className="text-sm text-gray-500 mt-2">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </header>

        <div className="prose prose-invert lg:prose-xl max-w-none text-gray-300 prose-headings:font-display prose-headings:text-white prose-strong:text-white space-y-4">
          <p>A sua privacidade é importante para nós. É política do Ouroboros Kingdom respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Ouroboros Kingdom, e outros sites que possuímos e operamos.</p>
          
          <h2 className="!mb-2">1. Coleta de Informações</h2>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
          <p>Coletamos diferentes tipos de informações para várias finalidades para fornecer e melhorar nosso serviço para você. Os tipos de dados coletados podem incluir:</p>
          <ul className="list-disc pl-5">
            <li><strong>Dados de Comentários:</strong> Quando os visitantes deixam comentários no site, coletamos os dados mostrados no formulário de comentários, além do endereço de IP e de dados do navegador do visitante, para auxiliar na detecção de spam.</li>
            <li><strong>Dados de Uso:</strong> Podemos coletar informações sobre como o Serviço é acessado e usado. Estes Dados de Uso podem incluir informações como o endereço de Protocolo de Internet do seu computador (por exemplo, endereço IP), tipo de navegador, versão do navegador, as páginas do nosso Serviço que você visita, a hora e a data da sua visita, o tempo gasto nessas páginas, identificadores de dispositivo exclusivos e outros dados de diagnóstico.</li>
          </ul>

          <h2 className="!mb-2">2. Uso de Cookies</h2>
          <p>Utilizamos cookies para armazenar informações, como as suas preferências pessoais quando visita o nosso website. Isto poderá incluir um simples pop-up ou uma ligação em vários serviços que providenciamos.</p>
          <p>Você pode configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado. No entanto, se você não aceitar cookies, pode não conseguir usar algumas partes do nosso Serviço.</p>

          <h2 className="!mb-2">3. Anúncios e Terceiros</h2>
          <p>Também utilizamos publicidade de terceiros no nosso website para suportar os custos de manutenção. Alguns destes anunciantes poderão utilizar tecnologias como os cookies e web beacons quando publicitam no nosso website, o que fará com que esses anunciantes (como o Google através do Google AdSense) também recebam a sua informação pessoal, como o endereço IP, o seu ISP, o seu browser, etc. Esta função é geralmente utilizada para geotargeting ou apresentar publicidade direcionada a um tipo de utilizador.</p>
          <p>O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso Serviço. O uso do cookie DART pelo Google permite que ele e seus parceiros veiculem anúncios para nossos usuários com base em sua visita ao nosso Serviço ou a outros sites na Internet. Os usuários podem optar por não usar o cookie DART visitando a página de política de privacidade da rede de conteúdo e anúncios do Google.</p>

          <h2 className="!mb-2">4. Links para Outros Sites</h2>
          <p>O nosso serviço pode conter links para outros sites que não são operados por nós. Se você clicar em um link de terceiros, você será direcionado para o site de terceiros. Aconselhamos vivamente que reveja a Política de Privacidade de todos os sites que visitar. Não temos controle e não assumimos qualquer responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros.</p>
          
          <h2 className="!mb-2">5. Segurança dos Dados</h2>
          <p>A segurança dos seus dados é importante para nós, mas lembre-se que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger seus Dados Pessoais, não podemos garantir sua segurança absoluta.</p>

          <h2 className="!mb-2">6. Seus Direitos</h2>
          <p>Você tem o direito de ser informado sobre a coleta e uso de seus dados pessoais. Você tem o direito de acessar seus dados pessoais e o direito de solicitar a correção de dados pessoais imprecisos ou a exclusão de seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil.</p>

          <h2 className="!mb-2">7. Alterações a Esta Política de Privacidade</h2>
          <p>Podemos atualizar nossa Política de Privacidade de tempos em tempos. Iremos notificá-lo de quaisquer alterações, publicando a nova Política de Privacidade nesta página. Aconselhamos que reveja esta Política de Privacidade periodicamente para quaisquer alterações.</p>

          <h2 className="!mb-2">8. Contato</h2>
          <p>Se tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através dos nossos canais de mídia social disponíveis no rodapé do site.</p>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPolicyPage;
