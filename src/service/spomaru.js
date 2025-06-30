'use strict';

const { dataSource } = require('../utils/database');
const spomaruPaymentSchema = require('../entity/log/spomaru-payment-schema');

/**
 *
 * @param {*} mac
 * @returns
 */
exports.checkSpomaruPayment = async (mac) => {
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    /** Formats date to a given format
     * 날짜 형식: DD/MM/YYYY HH:mm:ss PM/AM
     * **/
    const formattedDate = `${day}/${month}/${year} ${formattedHours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

    return formattedDate;
  }

  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(spomaruPaymentSchema);

    const existingPayment = await repo.findOneBy({ mac_address: mac });
    const currentTime = new Date();
    if (existingPayment) {
      existingPayment.end_date = formatDate(existingPayment.end_date);
      existingPayment.current_date = formatDate(currentTime);
      return existingPayment;
    } else {
      const newPayment = {
        mac_address: mac,
      };

      await repo.save(newPayment);
      const finalResult = await repo.findOneBy({ mac_address: mac });
      finalResult.end_date = formatDate(finalResult.end_date);
      finalResult.current_date = formatDate(currentTime);
      return finalResult;
    }
  } catch (error) {
    console.error('Error in checkSpomaruPayment:', error);
    throw error;
  }
};

exports.getSpomaruPaymentData = async () => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(spomaruPaymentSchema);

    const paymentData = await repo.find();

    return paymentData;
  } catch (error) {
    console.error('Error in checkSpomaruPayment:', error);
    throw error;
  }
};

exports.setSpomaruPaymentDetails = async (name, mac, end_date) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(spomaruPaymentSchema);

  const existingPaymentData = await repo.findOneBy({ mac_address: mac });

  if (existingPaymentData) {
    existingPaymentData.name = name;
    existingPaymentData.end_date = end_date;

    await repo.save(existingPaymentData);

    return existingPaymentData;
  } else {
    throw new Error('Payment data not found for the given MAC address');
  }
};
