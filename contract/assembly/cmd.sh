near call mtoan2111.testnet init_new_form '{"title": "test_dep"}' --account-id mtoan2111.testnet
near call mtoan2111.testnet get_form '{"id": "qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK"}' --account-id mtoan2111.testnet
near call mtoan2111.testnet new_question '{"formId": "qCsqqzSCyFzHgKCED2yfi7NDBDA5gGYjoSqhzzZvM9P816K9t", "type": 1, "title": "q_test2222333", "meta": "123123; 3123123"}' --account-id mtoan2111.testnet --gas=300000000000000
near call mtoan2111.testnet get_question '{"formId": "qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK", "index": 1}' --account-id mtoan2111.testnet --gas=300000000000000
near call mtoan2111.testnet get_forms '{"page": 1}' --account-id mtoan2111.testnet --gas=300000000000000
near view mtoan2111.testnet get_form_count '{"userId": "mtoan2111.testnet"}' --account-id mtoan2111.testnet

near call neutrino.testnet init_new_form '{\"title\": \"test_dep\"}' --account-id neutrino.testnet
near call neutrino.testnet get_form '{\"id\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\"}' --account-id neutrino.testnet
near call neutrino.testnet new_question '{\"formId\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\", \"type\": 1, \"title\": \"q_test2222333\", \"meta\": \"123123; 3123123\"}' --account-id neutrino.testnet --gas=300000000000000
near call neutrino.testnet get_question '{\"formId\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\", \"index\": 1}' --account-id neutrino.testnet --gas=300000000000000
near call neutrino.testnet get_forms '{"page": 1}' --account-id neutrino.testnet --gas=300000000000000

near call neutrino.testnet getFormTitle '{\"formId\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\"}' --account-id neutrino.testnet --gas=300000000000000
near call neutrino.testnet getNumOfQuestions '{\"formId\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\"}' --account-id neutrino.testnet --gas=300000000000000
near call neutrino.testnet getListParticipants '{\"formId\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\"}' --account-id neutrino.testnet --gas=300000000000000
near call neutrino.testnet getParticipantResult '{\"formId\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\", \"participantId\": \"neutrino.testnet\"}' --account-id neutrino.testnet --gas=300000000000000
near call neutrino.testnet getNumOfParticipant '{\"formId\": \"qCsqqzSCyFzHgKCED2yfi7NDBDA5gBhs7yJXj8YdmX22m9JJK\"}' --account-id neutrino.testnet --gas=300000000000000



near call mtoan2111.testnet submit_answer '{"formId": "qCsqqzSCyFzHgKCED2yfi7NDBDA5gJBxZeqzpXWbSZWx8RsQb", "questionId": "FpT3nqdVbtLzUgDivzP36FLrimTFT8xpLKmLFcnEnmaPPMS7jqsd2CMTZxWnHKd7kLqUYL9adE4zpoynW5QphCrtjJgbW", "answer": "yes"}' --account-id mtoan2111.testnet --gas=300000000000000
near view mtoan2111.testnet get_question '{"formId": "qCsqqzSCyFzHgKCED2yfi7NDBDA5gJBxZeqzpXWbSZWx8RsQb", "userId": "mtoan2111.testnet"}' --account-id mtoan2111.testnet
near call mtoan2111.testnet get_answer_statistical '{"formId": "cnPNVXsuPbXGrieN8SpJKSb9yMD7LqKLwBPvBeVqpHL82", "userId": "xtest6.testnet", "page": 1}' --account-id mtoan2111.testnet --gas=300000000000000
near view mtoan2111.testnet get_participants '{"formId": "qCsqqzSCyFzHgKCED2yfi7NDBDA5oKTYsPrSLAAsLpUZZzcEt", "page": 1}' --account-id mtoan2111.testnet
near view mtoan2111.testnet get_questions '{"formId": "qCsqqzSCyFzHgKCED2yfi7NDBDA5gJBxZeqzpXWbSZWx8RsQb", "userId": "mtoan2111.testnet", "page": 1}' --account-id mtoan2111.testnet
near call mtoan2111.testnet delete_question '{"id":"FpT3nqdVbtLzUgDivzP36FLrimTFT8xpLKmLFcnEnmaPPMS7jqsd2CMTZxWnHKd7kLqUYL9adE4zpoynW5QphCrtjJgbW"}' --account-id mtoan2111.testnet --gas=300000000000000