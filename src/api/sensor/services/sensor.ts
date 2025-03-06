/**
 * sensor service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::sensor.sensor",
  ({ strapi }) => ({
    async create(params) {
      const result = await super.create(params);
      console.log("params create", params, result);
      const alerts = [];

      //  Condição para o pH (exemplo: fora da faixa 6.5 - 8.5)
      if (result.pH < 6.5 || result.pH > 8.5) {
        alerts.push(`pH fora do ideal! Valor: ${result.pH}`);
      }

      // Condição para Turbidez (exemplo: maior que 5 NTU)
      if (result.Turbidez > 5) {
        alerts.push(`Turbidez elevada! Valor: ${result.Turbidez} NTU`);
      }

      // ⚠️ Condição para TDS (exemplo: maior que 500 ppm)
      if (result.TDS > 500) {
        alerts.push(`TDS elevado! Valor: ${result.TDS} ppm`);
      }

      //  Condição para a Bateria (exemplo: menor que 20%)
      if (Number(((result.BaterySlave / 4.2) * 100).toFixed(2)) < 20) {
        alerts.push(
          `Nível de bateria baixo! Valor: ${((result.BaterySlave / 4.2) * 100).toFixed(2)}%`
        );
      }
      if (alerts.length > 0) {
        const alertMessage = alerts.join("\n");

        await strapi.documents("api::notification.notification").create({
          data: {
            message: alertMessage,
            sensorId: result.sensorId,
          },
          status: "published",
        });

        console.log("Notificação de alerta criada:", alertMessage);
      } else {
        console.log("Nenhum alerta necessário.");
      }
      return result;
    },
  })
);
