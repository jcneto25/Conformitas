import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

export interface ConteudoPdf {
  titulo: string;
  subtitulo: string;
  corpo: string;
}

@Injectable()
export class RelatorioPdfService {
  // Compila os campos de apresentação do PDF a partir do relatório (pure, testável).
  buildConteudo(relatorio: any): ConteudoPdf {
    const auditoria = relatorio?.auditoria || {};
    const subtitulo = [auditoria.numero, auditoria.unidadeAuditada]
      .filter(Boolean)
      .join(' — ');
    return {
      titulo: `Relatório ${relatorio?.tipo || ''}`.trim(),
      subtitulo,
      corpo: relatorio?.conteudo || '',
    };
  }

  // Renderiza o relatório como PDF (A4) e devolve o binário.
  gerarPdf(relatorio: any): Promise<Buffer> {
    const { titulo, subtitulo, corpo } = this.buildConteudo(relatorio);
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve) =>
      doc.on('end', () => resolve(Buffer.concat(chunks))),
    );

    doc.fontSize(20).text(titulo, { align: 'center' });
    if (subtitulo) {
      doc.moveDown(0.5).fontSize(11).fillColor('gray').text(subtitulo, { align: 'center' });
    }
    doc.moveDown().fillColor('black');
    if (corpo) {
      doc.fontSize(12).text(corpo);
    }
    doc.end();

    return done;
  }
}
