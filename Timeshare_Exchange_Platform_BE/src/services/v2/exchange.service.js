const bcrypt = require('bcrypt');
const moment = require("moment");
const ExchangeModel = require("../../models/exchanges");
const TimeshareModel = require("../../models/timeshares");
const tripService = require("./trip.service");
const emailService = require('./email.service');
const tokenService = require('./token.service')
const ReservationModel = require('../../models/reservations')

class ExchangeService {
    
    async MakeExchange(timeshareId, myTimeshareId, type, userId, fullName, phone, email, amount, status, request_at, country,
        street,
        city,
        province,
        zipCode,) {
        try {
            const existingExchangeCompleted = await ExchangeModel.findOne({ myTimeshareId: myTimeshareId, status: 'Completed' });
            const checkStatus = await ExchangeModel.findOne({ timeshareId: timeshareId, status: 'Completed' });
            const existingExchange = await ExchangeModel.findOne({ myTimeshareId: myTimeshareId, timeshareId: timeshareId });
            const timeshare = await TimeshareModel.findById(timeshareId);
            const myTimeshare = await TimeshareModel.findById(myTimeshareId);
            const countExchange = await ExchangeModel.countDocuments({ timeshareId: timeshareId, type: 'exchange' });
            const countRent = await ReservationModel.countDocuments({ timeshareId: timeshareId, type: 'rent' });
            const count = countExchange + countRent
            const to =  timeshare.current_owner.email;

            if ( checkStatus ) {
                throw new Error('Request is existed');
            }
            if (existingExchangeCompleted) {
                throw new Error('Request is existed');
            }  
            else if (existingExchange) {
                throw new Error('Request is existed');
            }
            else if (timeshare?.current_owner?._id === myTimeshare?.current_owner?._id) {
                console.log(timeshare?.current_owner?._id )
                console.log(myTimeshare?.current_owner?._id )
                throw new Error(`This is your timehshare, you can't exchange`);
            }
            const address = {country, street, city, province, zipCode}
            const exchangeData = {
                timeshareId: timeshareId,
                myTimeshareId: myTimeshareId,
                type: 'exchange',
                userId: userId,
                fullName: fullName,
                phone: phone,
                email: email,
                amount: amount,
                status: status,
                request_at:request_at,
                address,
            };

            emailService.SendRequestExchange(to, timeshare, count, countExchange, countRent);
    
            const exchange = await ExchangeModel({ ...exchangeData });
            return exchange.save().catch(); 
            
        } catch (error) {
            throw new Error('Error request');
        }
    }
  
    async ConfirmExchange(exchangeId) {
        try {
            const exchange = await ExchangeModel.findById(exchangeId);
            if (!exchange) {
                throw new Error('Reservation not found');
            }
            const timeshare = await TimeshareModel.findById(exchange.timeshareId);
            const myTimeshare = await TimeshareModel.findById(exchange.myTimeshareId);
            console.log(myTimeshare.owner_exchange);
            console.log(timeshare.owner_exchange);
    
            if (myTimeshare.is_bookable === false) {
                throw new Error('Timeshare is not bookable');
            }

            await ExchangeModel.updateOne(
                { _id: exchangeId },
                {
                    $set: {
                        status: 'Completed',
                        confirmed_at: new Date(),
                    },
                }
            );
    
            if (!timeshare || !myTimeshare) {
                throw new Error('Timeshare not found');
            }
    
            await TimeshareModel.updateOne(
                { _id: exchange.timeshareId },
                {
                    $set: {
                        owner_exchange: myTimeshare.owner_exchange,
                        is_bookable: false,
                    },
                }
            );
    
            await TimeshareModel.updateOne(
                { _id: exchange.myTimeshareId },
                {
                    $set: {
                        owner_exchange: timeshare.owner_exchange,
                        is_bookable: false,
                    },
                }
            );
    
            await tripService.CreateTripExchange(exchange);
            await tripService.CreateTripByMyTimeshareId(exchange);
            const toOwnerMyTimeshare = exchange.email;
            const toOwnerTimeshare = exchange.timeshareId.current_owner.email;
            console.log(toOwnerTimeshare);
            console.log(toOwnerMyTimeshare);
            emailService.NotificationExchangeSuccessToOwnerTimeshareId(toOwnerTimeshare, exchange);
            emailService.NotificationExchangeSuccessToOwnerMyTimeshareId(toOwnerMyTimeshare, exchange);
            // cancel  toàn bộ liên quan đến 2 timeshare if completed
            await ExchangeModel.updateMany(
                { timeshareId: exchange.timeshareId, type: 'exchange', status: { $ne: 'Completed' } },
                { $set: { status: 'Canceled' } }
            );
            await ExchangeModel.updateMany(
                { myTimeshareId: exchange.myTimeshareId, type: 'exchange', status: { $ne: 'Completed' } },
                { $set: { status: 'Canceled' } }
            );
    
            return {
                exchange_id: exchange.timeshareId,
                code: 200,
                confirmed_at: exchange.confirmed_at,
                message: 'Guest name confirmed',
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async GetExchangeRequestOfTimeshare(timeshareId){
        return ExchangeModel.find({timeshareId: timeshareId, type: 'exchange'});

    }

    async GetExchangeById(id) {
        return ExchangeModel.findById(id).lean();
    }

    async CancelExchange(exchangeId) {
        try {
            const exchange = await ExchangeModel.findById(exchangeId);
            if (!exchange) {
                throw new Error('Reservation not found');
            }
    
            await ExchangeModel.updateOne(
                { _id: exchangeId },
                {
                    $set: {
                        status: 'Canceled',
                        confirmed_at: new Date()
                    }
                }
            );
          
            const toOwnerMyTimeshare = exchange.email;
            console.log(toOwnerMyTimeshare)
            await emailService.NotificationExchangeCancelToOwnerMyTimeshareId(toOwnerMyTimeshare, exchange);
    
            return {
                exchange_id: exchange.timeshareId,
                code: 200,
                confirmed_at: exchange.confirmed_at,
                message: 'Guest name confirmed'
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async GetExchangeOfUser(userId) {
        return ExchangeModel.find({userId: userId});
    }
    async GetMyTimeshareExchange(userId) {
        return ExchangeModel.find({userId: userId});
    }
    async CancelMyExchangeRequest(exchangeId) {
        try {
            const existingExchange = await ExchangeModel.findOne({ _id: exchangeId });
            if (!existingExchange.timeshareId.is_bookable) {
                return false; 
            }
            if (!existingExchange) {
                throw new Error('Exchange not exists');
            }
    
            if (existingExchange.deleted) {
                return false; 
            }
            await ExchangeModel.updateOne(
                { _id: exchangeId },
                {
                    $set: {
                        status: 'Canceled',
                        confirmed_at: new Date(),
                        is_canceled: true,
                    }
                }
            );
            const deletedExchange = await ExchangeModel.updateOne({ _id: exchangeId },
                {
                    $set: {
                        is_canceled: true,
                        confirmed_at: new Date(),
                    }
                });
            return deletedExchange;
        } catch (error) {
            throw new Error('Error: ' + error.message);
        }
    }
    async DeleteMyExchangeRequest(exchangeId) {
        const deleteExchange = await ExchangeModel.delete({_id: exchangeId})
        return deleteExchange;
    }
    
   
}

async function checkAndUpdateExchangesStatus() {
    const exchanges = await ExchangeModel.find({ status: { $in: ['Agreement phase'] } });
    console.log(exchanges);
    exchanges.forEach(async (exchange) => {
        const lastUpdatedTime = exchange.request_at;
        const currentTime = new Date();
        const timeDiffInHours   = Math.abs(currentTime - lastUpdatedTime) / 36e5;
        console.log(lastUpdatedTime);

        if (timeDiffInHours   >= 1) {

            await ExchangeModel.findByIdAndUpdate({ _id: exchange._id }, { status: 'Expired' });
        }
    });
}

setInterval(checkAndUpdateExchangesStatus, 24 * 60 * 60 * 1000);

module.exports = new ExchangeService;
