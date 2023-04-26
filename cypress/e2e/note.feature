Feature: Note test
    E2E tests for note application

    Scenario: A01 - Verify application elements without notes
      Given I open "Note" application
      Then I expect application page is opened
        And I expect "Empty note image" element is visible
        And I expect "No notes label" element is visible
        And I expect "Add notes label" element is visible
        And I expect "Text input" element is visible
        And I expect "error message": "maximum word length exceeded" is not displayed
        And I expect application have no records

    Scenario: A02 - Verify application elements with note
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "TEST" text in input field
        And I expect "error message": "maximum word length exceeded" is not displayed
      When I press "Enter" key on keyboard
      Then I expect application have 1 record
        And I expect "Empty note image" element is not visible
        And I expect "No notes label" element is not visible
        And I expect "Add notes label" element is visible
        And I expect "Text input" element is visible
        And I expect "Note text" for note record "#1" is visible
        And I expect "Remove button" for note record "#1" is visible
        And I expect "Weather icon" for note record "#1" is visible
        And I expect "Weather temperature" for note record "#1" is visible
        And I expect "Creation date" for note record "#1" is visible
        And I expect "Creation time" for note record "#1" is visible

    Scenario: OP01 - Verify record is created without any text (by press key "enter" in input)
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I press "Enter" key on keyboard
        And I expect application have 1 record
      Then I expect "record note text" is empty for record "#1"

    Scenario Outline: OP02 - Verify record is created with "<note text>" set of characters
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "<note text>" text in input field
        And I press "Enter" key on keyboard
        And I expect application have 1 record
      Then I verify "note text" for record "#1"

      Examples:
      | note text                |
      | <numeric 30>             |
      | <alphabetic 30>          |
      | <symbolic 30>            |
      | <string 30>              |
      | <emoji 30>               |
      | <string with spaces 299> |
      | <string with spaces 300> |

    Scenario Outline: <case> - Verify error message displayed if char limit exceeded for <rule>
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "<note text>" text in input field
      Then I expect "error message": "<error message>" is displayed

      Examples:
      | case | rule              | note text                | error message                         |
      | DV01 | common length 301 | <string with spaces 301> | maximum number of characters exceeded |
      | DV03 | 1 word length 31  | <string 31>              | maximum word length exceeded          |

    Scenario Outline: <case> -  Verify note record is not created if char limit exceeded for <rule>
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "<note text>" text in input field
        And I press "Enter" key on keyboard
      Then I expect application have no records

      Examples:
      | case | rule              | note text                | error message                         |
      | OP06 | common length 301 | <string with spaces 301> | maximum number of characters exceeded |
      | OP07 | 1 word lenght 31  | <string 31>              | maximum word length exceeded          |

    Scenario Outline: <case> - Verify note record is created when limit error fixed for <rule>
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "<note text>" text in input field
        And I expect "error message": "<error message>" is displayed
      When I press "Backspace" key on keyboard
        And I expect "error message": "<error message>" is displayed
        And  I press "Backspace" key on keyboard
      Then I expect "error message": "<error message>" is not displayed
        And I press "Enter" key on keyboard
      Then I expect application have 1 record
      Examples:
      | case | rule              | note text                | error message                         |
      | DV02 | common length 302 | <string with spaces 302> | maximum number of characters exceeded |
      | XXXX | common length 301 | <string with spaces 301> | maximum number of characters exceeded |
      | DV04 | 1 word length 32  | <string 32>              | maximum word length exceeded          |

    Scenario: OP04, A03 - Verify click on Cross button removes record
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "TEST" text in input field
      When I press "Enter" key on keyboard
      Then I expect application have 1 record
        And I click on "Remove button" for note record "#1"
      Then I expect application have no records
        And I expect "Empty note image" element is visible
        And I expect "No notes label" element is visible
        And I expect "Add notes label" element is visible
        And I expect "Text input" element is visible
        And I expect "Note text" for note record "#1" is not visible
        And I expect "Remove button" for note record "#1" is not visible
        And I expect "Weather icon" for note record "#1" is not visible
        And I expect "Weather temperature" for note record "#1" is not visible
        And I expect "Creation date" for note record "#1" is not visible
        And I expect "Creation time" for note record "#1" is not visible

    Scenario: OP05 - Verify click on Cross button removes right record
      Given I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "TEST" text in input field
      When I press "Enter" key on keyboard
      Then I expect application have 1 record
        And I type "TEST_2" text in input field
      When I press "Enter" key on keyboard
      Then I expect application have 2 records
        And I type "TEST_3" text in input field
      When I press "Enter" key on keyboard
      Then I expect application have 3 records
        And I click on "Remove button" for note record "#2"
      Then I expect application have 2 records
        And I expect note text "TEST_2" is not present in record "#1"
        And I expect note text "TEST_2" is not present in record "#2"

    Scenario: DV05 - Verify Application creates records with correct Date and Time
      Given I set browser system time as "2023"-"04"-"24" "12":"01"
        And  I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "Date & time test" text in input field
        And I press "Enter" key on keyboard
        And I expect application have 1 record
      Then I verify "note text" for record "#1"
      """
      Date & time test
      """
        And I verify "date" for record "#1"
      """
      24 Apr 2023
      """
        And I verify "time" for record "#1"
      """
      12 : 01
      """
      When I add "300" seconds to current "cy.clock" time
        And I type "Date & time test 2" text in input field
        And I press "Enter" key on keyboard
        And I expect application have 2 record
      Then I verify "note text" for record "#2"
      """
      Date & time test 2
      """
        And I verify "date" for record "#2"
      """
      24 Apr 2023
      """
        And I verify "time" for record "#2"
      """
      12 : 06
      """

    Scenario Outline: Verify application behaviour with response status: <status> during API call for weather info
      Given I prepare to intercept "GET" request on "**/data/2.5/weather**" as "weatherData" and set "<status>" response status
      """
      {
        "weather": [
          {
            "icon": "<icon>"
          }
        ],
        "main": {
          "temp": "<temp>"
        }
      }
      """
      Then  I open "Note" application
        And I expect application page is opened
        And I expect application have no records
        And I type "<message>" text in input field
        And I press "Enter" key on keyboard
        And I expect application have 1 record
        And I verify "note text" for record "#1"
      """
      <message>
      """
        And I verify "weather icon" for record "#1"
      """
      <record icon>
      """
      Then I verify "temperature" for record "#1"
      """
      <record temp>
      """

      Examples:
      | case | message          | status | icon | temp | record icon | record temp |
      | DV06 | Weather test 200 | 200    | 13d  | 5    | 13d@2x.png  | +5 C        |
      | DV07 | Weather test 500 | 500    | 13d  | 5    | @2x.png     | C           |
      | DV08 | Weather test 400 | 400    | 13d  | 5    | @2x.png     | C           |
      | DV09 | Weather test 300 | 300    | 13d  | 5    | @2x.png     | C           |
      | DV10 | Weather test 200 | 200    |      |      | @2x.png     | C           |
